import React from "react";
import { Info } from "lucide-react";

/**
 * Renders one post body block. The shapes are documented in lib/journal.js;
 * this stays deliberately small so adding a block type is one case here and
 * one entry there.
 */
const Block = ({ block }) => {
  switch (block.t) {
    case "h2":
      return (
        <h2 className="font-display mt-14 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight">
          {block.x}
        </h2>
      );

    case "ul":
      return (
        <ul className="mt-7 space-y-3.5">
          {block.x.map((item) => (
            <li
              key={item}
              className="flex gap-4 text-[16.5px] leading-[1.75] text-[color:var(--paper-dim)]"
            >
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#4fd1e3]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="mt-7 space-y-4">
          {block.x.map((item, i) => (
            <li
              key={item}
              className="flex gap-4 text-[16.5px] leading-[1.75] text-[color:var(--paper-dim)]"
            >
              <span className="font-mono mt-1 shrink-0 text-[13px] text-[#63e6a8]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case "note":
      return (
        <div className="mt-9 flex gap-4 rounded-[22px] border border-[#4fd1e3]/25 bg-[#4fd1e3]/[0.06] p-6">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4fd1e3]" />
          <p className="text-[15px] leading-relaxed text-[color:var(--paper-dim)]">{block.x}</p>
        </div>
      );

    case "quote":
      return (
        <figure className="my-12 border-l-2 border-[#63e6a8]/50 pl-7">
          <blockquote className="font-display text-[clamp(1.3rem,2.2vw,1.75rem)] leading-[1.35]">
            {block.x}
          </blockquote>
          {block.cite && <figcaption className="eyebrow mt-5">{block.cite}</figcaption>}
        </figure>
      );

    default:
      return (
        <p className="mt-7 text-[16.5px] leading-[1.75] text-[color:var(--paper-dim)]">{block.x}</p>
      );
  }
};

const PostBody = ({ blocks }) => (
  <>
    {blocks.map((block, i) => (
      <Block key={`${block.t}-${i}`} block={block} />
    ))}
  </>
);

export default PostBody;
