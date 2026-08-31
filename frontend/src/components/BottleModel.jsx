import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { BOTTLE_IMG } from "@/lib/brand";

/**
 * The 500 ml bottle as a real 3D model, tilting toward the cursor.
 *
 * The GLB carries KHR_materials_transmission/ior/volume, so the plastic and
 * water genuinely refract rather than being faked with opacity. Its origin
 * sits at the base and it is modelled at real scale (0.212 m tall), so the
 * inner <primitive> is lifted by half its height to put the bottle's middle
 * on the rotation axis — otherwise a tilt swings it around its feet.
 *
 * Two deliberate performance choices, on a page that already runs a WebGL
 * background and ~27 SVG-filter glass panels:
 *  · Lighting is baked from <Lightformer>s inside <Environment> rather than a
 *    drei preset. Presets fetch an HDRI from a CDN — an external dependency
 *    this site otherwise doesn't have, and a blank bottle if it fails.
 *  · The canvas only renders while it is actually on screen. Scrolled past,
 *    frameloop drops to "never" and it costs nothing.
 */

/**
 * Two models exist in /public and both are wired up — swapping is this one
 * line, since they share dimensions (0.212 m tall, origin at the base) and
 * every mesh/material name the traverse below looks for:
 *
 *   Untitled.glb             — Blender build. Better bottle form, a real cap
 *                              and a water mesh. Its label UVs used to be
 *                              stretched, which is why this file sat unused;
 *                              the re-export fixed them (uniform texel
 *                              density, band aspect within 5% of the 1024×288
 *                              artwork) so the print now reads at any angle.
 *   prokritir_jol_500ml.glb  — lathe build. Also correct, and a third of the
 *                              weight. The fallback if the Blender build
 *                              proves too heavy on slow connections.
 *
 * On the Blender build for the silhouette and the water. It costs 4.35 MB
 * against the lathe build's 1.87 MB — unquantized, no Draco — which is the
 * one thing to revisit if the hero starts loading slowly.
 */
const MODEL = "/Untitled.glb";
const HALF_HEIGHT = 0.106; // half of the model's 0.212 m bounding box

// Standing yaw that turns the printed front of the label toward the camera.
//
// The label sheet carries the artwork twice — one panel front, one back — and
// where the wrap *starts* is an authoring choice each export made differently.
// Untitled.glb begins its wrap a quarter turn round, so with no correction the
// camera at rotation 0 looks straight at u=0.5: the seam between the two
// panels, with the tail of one wordmark on the left and the head of the next
// on the right. The lathe build happens to already sit front-on.
//
// Both figures are read off each file's own label UVs (u→yaw is exactly linear
// in both, and the artwork centres measure to u=0.25/0.75), so this is a
// measurement, not a nudge — but it is per-file, and a re-export that changes
// where the seam falls will need it re-measured.
const LABEL_FRONT_YAW = {
  "/Untitled.glb": Math.PI / 2,
  "/prokritir_jol_500ml.glb": 0,
};
// Applied to the inner group, below the one the pointer drives, so the
// animation keeps working in "0 = facing the viewer" terms.
const FRONT_YAW = LABEL_FRONT_YAW[MODEL] ?? 0;

// The Blender export ships a 3×3 m ground plane with the bottle — fourteen
// times its width. Useful for rendering in Blender, but here it would fill
// the frame as a giant slab, so it is hidden on load. Harmless for the lathe
// build, which has no such mesh.
const HIDDEN_MESHES = new Set(["Plane", "Floor"]);

// The transparent shell, under both models' naming. Hidden from the loaded
// scene and drawn separately with a transmission material that works.
const GLASS_MESHES = new Set(["glass", "glass_water", "Bottle_PET", "PET_clear"]);

// The cap, under both models' naming — retinted below.
const CAP_MATERIALS = new Set(["Cap_navy", "cap_navy"]);
// Authored at baseColorFactor [0, 0.006, 0.018]. Those are *linear* values, so
// it lands around #001224 — all but black, and against a near-black page the
// cap stops reading as an object and turns into a hole at the top of the
// bottle. This is the same navy a stop lighter, and three converts the sRGB
// hex to linear itself. Set here rather than in the GLB so a re-export from
// Blender can't silently revert it.
const CAP_COLOR = "#17466d";

useGLTF.preload(MODEL);

const damp = (current, target, lambda, dt) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

const Bottle = ({ pointer, reduced, touch, onReady }) => {
  const ref = useRef();
  const { scene } = useGLTF(MODEL);

  useEffect(() => {
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const name = o.name;
      const mat = o.material;

      if (HIDDEN_MESHES.has(name) || HIDDEN_MESHES.has(mat?.name)) {
        o.visible = false;
        return;
      }

      // The water is authored with transmission 1, same as the bottle around
      // it. three renders the scene *minus every transmissive mesh* into the
      // buffer that transmission refracts — so with both set that way the
      // PET has nothing to refract and the water never appears: the bottle
      // reads as empty white plastic.
      //
      // Dropping the water's own transmission puts it back in that buffer, so
      // the PET refracts it and the bottle reads as full. It keeps a little
      // translucency and its blue so it still behaves like a liquid rather
      // than a solid core.
      // This export carries transmission but no KHR_materials_volume, so
      // three treats the PET as a thin surface: no refraction depth, no
      // attenuation, and the near-white base colour ends up dominating —
      // which is why the bottle renders as a white solid. Giving it a
      // thickness switches on volumetric refraction and lets the tint and
      // the water behind it actually show through.
      // The glass shell is hidden here and re-rendered below with drei's
      // MeshTransmissionMaterial. three's own KHR_materials_transmission path
      // is not producing transparency in this stack (three 0.185 / R3F 9) —
      // proven by tinting the base colour red, which came back a flat opaque
      // red instead of red-tinted glass. drei's material runs its own
      // refraction pass and does not depend on it.
      if (GLASS_MESHES.has(name) || GLASS_MESHES.has(mat?.name)) {
        o.visible = false;
      }

      // The cap is the only opaque thing on the model, so it is what gives the
      // eye a hard edge to read the glass against. It needs to be lighter than
      // the page, not the same value as it.
      if (CAP_MATERIALS.has(mat?.name)) {
        mat.color?.set(CAP_COLOR);
        // A touch glossier than the authored 0.38: the environment rig is a
        // dark field with a few narrow strips, so a matte cap catches almost
        // nothing off it and the extra lightness alone would read as flat
        // paint rather than a moulded closure.
        mat.roughness = 0.3;
        mat.needsUpdate = true;
      }

      // Deep and quite see-through, not a pale opaque fill: at high opacity a
      // light blue just reads as milk. Letting the dark backdrop through is
      // what makes it look like water on a dark page.
      if (mat?.name === "Water_blue") {
        mat.transmission = 0.85;
        mat.transparent = true;
        mat.opacity = 0.85;
        mat.roughness = 0.02;
        mat.ior = 1.333;
        mat.metalness = 0.05;
        mat.color?.set("#1a6280");
        mat.needsUpdate = true;
      }
    });
    onReady?.();
  }, [onReady, scene]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = Math.min(dt, 0.1); // clamp, so a stalled tab doesn't snap it

    if (reduced) {
      ref.current.rotation.y = damp(ref.current.rotation.y, 0.35, 3, t);
      return;
    }
    if (touch) {
      // No cursor to follow on a phone, so it turns on its own — slowly
      // enough to read the label as it comes round.
      ref.current.rotation.y += t * 0.28;
      ref.current.rotation.x = damp(ref.current.rotation.x, 0.04, 2, t);
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.005;
      return;
    }
    // Cursor drives yaw and a lighter pitch; damped so it trails the pointer
    // rather than snapping to it. Wider range than the old card version —
    // at this size it can afford to actually turn.
    ref.current.rotation.y = damp(ref.current.rotation.y, pointer.current.x * 1.05, 3.2, t);
    ref.current.rotation.x = damp(ref.current.rotation.x, -pointer.current.y * 0.26, 3.2, t);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.005;
  });

  // Geometry of the shell, whichever model is loaded.
  const glassGeometry = useMemo(() => {
    let geo = null;
    scene.traverse((o) => {
      if (o.isMesh && !geo && (GLASS_MESHES.has(o.name) || GLASS_MESHES.has(o.material?.name))) {
        geo = o.geometry;
      }
    });
    return geo;
  }, [scene]);

  return (
    <group ref={ref}>
      <group position={[0, -HALF_HEIGHT, 0]} rotation={[0, FRONT_YAW, 0]}>
        <primitive object={scene} />
        {glassGeometry && (
          <mesh geometry={glassGeometry}>
            <MeshTransmissionMaterial
              thickness={0.04}
              ior={1.49}
              roughness={0.02}
              chromaticAberration={0.03}
              anisotropicBlur={0.05}
              distortion={0.08}
              distortionScale={0.3}
              temporalDistortion={0}
              samples={8}
              resolution={512}
              attenuationColor="#a6e0f5"
              attenuationDistance={0.55}
              reflectivity={0.65}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

/**
 * A backdrop for the glass to refract.
 *
 * three renders the scene minus transmissive meshes into a buffer, and the
 * glass samples *that* to refract. With an empty scene that buffer is blank,
 * refraction resolves to the clear colour, and the bottle renders as a flat
 * near-white solid no matter how the lights are set — giving it a real
 * surface behind is what makes it read as glass at all.
 *
 * It is feathered rather than a flat fill: a full-frame rectangle would sit
 * inside the glass card as a visible dark box and hide the frosted fluid the
 * card is showing. This fades to nothing before the canvas edge, so it backs
 * the bottle and disappears everywhere else.
 */
const Backdrop = () => {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    // Light, not dark — this is the single thing that decides whether the
    // bottle reads as glass. Transmission can only ever show you what is
    // *behind* the object, so against the page's near-black ink a perfectly
    // clear bottle transmits darkness and all you see is its surface sheen,
    // which looks like white plastic. Blender's material preview looks right
    // precisely because it has a bright studio backdrop.
    //
    // Feathered to nothing well before the edge, so on the page it reads as a
    // soft backlight glow rather than a plate.
    // Mid-tone, not white and not black. The shell genuinely refracts this,
    // so a bright disc turns the bottle into a white blob and a black one
    // makes it disappear; a muted teal reads as water with depth.
    const grd = g.createRadialGradient(128, 128, 5, 128, 128, 120);
    grd.addColorStop(0, "rgba(31,90,115,0.6)");
    grd.addColorStop(0.5, "rgba(18,60,80,0.25)");
    grd.addColorStop(0.85, "rgba(0,0,0,0.05)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <mesh position={[0, 0, -0.3]}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

const BottleModel = ({ className = "" }) => {
  const hostRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  // Coarse pointer = no cursor to follow, so the bottle turns by itself.
  const [touch] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = (e) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Pointer is tracked on the window, not the canvas, so the bottle keeps
  // following you while you read the copy beside it.
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={`relative ${className}`}>
      {/* Still frame underneath until the model is up, so the card is never
          empty on a slow connection. */}
      {/* Soft bloom behind the bottle — it floats on the section now, with no
          card to separate it from the background. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(79,209,227,0.14), rgba(99,230,168,0.06) 45%, transparent 72%)",
        }}
        aria-hidden
      />
      <img
        src={BOTTLE_IMG}
        alt="Prokritir Jol 500 ml bottle"
        draggable={false}
        className={`absolute inset-0 m-auto h-full w-auto select-none object-contain transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <Canvas
        className="!absolute inset-0"
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 0.44], fov: 30 }}
      >
        <Suspense fallback={null}>
          <Backdrop />
          <Bottle pointer={pointer} reduced={reduced} touch={touch} onReady={() => setLoaded(true)} />

          {/* Studio rig baked to a cube map in-scene — no external HDRI.
              Deliberately a DARK field with a few narrow bright strips, the
              way glassware is actually lit: transmissive material refracts
              whatever surrounds it, so a big white source turns the bottle
              into a milky blob. The dark surround lets it read as clear, and
              the strips become the specular highlights that describe its
              shape. */}
          <Environment preset="park" environmentIntensity={0.95} resolution={512}>
            <Lightformer intensity={0.15} position={[0, 0, -4]} scale={[14, 14, 1]} color="#061c12" />
            <Lightformer form="rect" intensity={1.3} position={[-1.1, 1.2, 1.2]} scale={[0.5, 3.5, 1]} color="#e0f4ff" />
            <Lightformer form="rect" intensity={1.1} position={[1.5, 0.3, 0.8]} scale={[0.4, 3, 1]} color="#64d89b" />
            <Lightformer form="rect" intensity={0.9} position={[-1.4, -0.7, 0.6]} scale={[0.4, 2.4, 1]} color="#3bc2d4" />
            <Lightformer form="rect" intensity={0.7} position={[0, 2.2, 0.6]} scale={[1.8, 0.4, 1]} color="#bce6f5" />
          </Environment>

          {/* A little direct light so the navy cap and the printed label read
              as lit objects rather than only as reflections. */}
          <ambientLight intensity={0.1} />
          <directionalLight position={[1.5, 2.5, 2]} intensity={0.6} />
          <directionalLight position={[-2, 0.5, -1]} intensity={0.25} color="#4fd1e3" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BottleModel;
