import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/PostCard";
import PostBody from "@/components/PostBody";
import GlassPanel from "@/components/GlassPanel";
import CtaBand from "@/components/sections/CtaBand";
import { BRAND } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";
import {
  JOURNAL_INTRO,
  SORTED_POSTS,
  formatDate,
  readingMinutes,
  getAuthor,
  getPost,
  getRelated,
} from "@/lib/journal";

/**
 * The Journal  a grid of posts, and the expanded reader for one of them.
 *
 * Both live on the single /journal route, with the hash deciding which is on
 * screen: /journal is the grid, /journal#the-monsoon-problem is that post
 * opened. Doing it through the URL rather than component state is what buys
 * the back button, a shareable link to a specific piece, and a working browser
 * refresh  none of which a `useState` toggle would give.
 *
 * ScrollManager watches the hash too. The expanded view deliberately puts no
 * `id` on its article, so ScrollManager finds no anchor target and starts the
 * reader at the top rather than part-way down it.
 */

/* ── The grid ───────────────────────────────────────────────── */
const Index = () => (
  <>
    <section className="relative overflow-hidden pb-14 pt-36 md:pb-16 md:pt-44">
      <div className="aurora drift absolute -left-40 -top-32 h-[520px] w-[520px]" aria-hidden />
      <div className="aurora aurora-mint drift absolute -right-40 top-20 h-[460px] w-[460px]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="max-w-3xl">
          <div className="eyebrow">{JOURNAL_INTRO.eyebrow}</div>
          <h1 className="font-display mt-6 text-[clamp(2.4rem,5.6vw,4.4rem)]">
            {JOURNAL_INTRO.title}{" "}
            <em className="italic ink-accent">{JOURNAL_INTRO.titleAccent}</em>
          </h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-[color:var(--paper-dim)]">
            {JOURNAL_INTRO.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[color:var(--paper-faint)]">
            <span>{SORTED_POSTS.length} pieces</span>
            <span className="h-1 w-1 rotate-45 bg-[#4fd1e3]" />
            <span>Written in {BRAND.origin}</span>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="relative px-6 pb-20 md:px-10 md:pb-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="rule mb-12" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="journal-grid">
          {SORTED_POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i, 5) * 0.06} className="h-full">
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </>
);

/* ── One post, expanded ─────────────────────────────────────── */
const Article = ({ post }) => {
  const { open } = useOrder();
  const author = getAuthor(post);
  const related = getRelated(post.slug);

  return (
    <>
      <article>
        <header className="relative overflow-hidden pb-4 pt-32 md:pt-40">
          <div className="aurora drift absolute -right-40 -top-20 h-[520px] w-[520px]" aria-hidden />

          <div className="relative z-10 mx-auto max-w-[820px] px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--paper-dim)] transition-colors hover:text-[#4fd1e3]"
                data-testid="post-back-link"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> All posts
              </Link>

              <div className="mt-9 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[color:var(--paper-faint)]">
                <span className="rounded-full border border-[#63e6a8]/30 bg-white/[0.06] px-3.5 py-1.5 text-[#8df0c0]">
                  {post.category}
                </span>
                <span>{formatDate(post.date)}</span>
                <span className="h-1 w-1 rotate-45 bg-[#4fd1e3]" />
                <span>{readingMinutes(post)} min read</span>
              </div>

              <h1 className="font-display mt-7 text-[clamp(2.1rem,4.8vw,3.5rem)] leading-[1.05]">
                {post.title}
              </h1>

              <p className="mt-7 text-[18px] leading-relaxed text-[color:var(--paper-dim)]">
                {post.subtitle}
              </p>

              <div className="mt-9 flex items-center gap-4">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-bold text-[#052029]"
                  style={{ background: "linear-gradient(135deg,#4fd1e3,#63e6a8)" }}
                >
                  {author.initials}
                </span>
                <span>
                  <span className="block text-[14.5px] font-semibold">{author.name}</span>
                  <span className="block text-[12px] text-[color:var(--paper-faint)]">
                    {author.role}
                  </span>
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Hero  wider than the text column, so the measure stays readable */}
        <div className="mx-auto mt-12 max-w-[1180px] px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[32px] border border-white/10"
          >
            <img
              src={post.image}
              alt={post.imageAlt}
              className="h-[clamp(240px,42vw,520px)] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040c13]/60 to-transparent" />
          </motion.div>
        </div>

        <div
          className="mx-auto max-w-[820px] px-6 pb-6 pt-14 md:px-10 md:pt-20"
          data-testid="post-body"
        >
          <PostBody blocks={post.body} />
        </div>
      </article>

      {/* Standing correction offer + order nudge */}
      <div className="mx-auto max-w-[820px] px-6 pb-20 md:px-10">
        <div className="rule mb-10" />
        <GlassPanel radius={28}>
          <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="eyebrow">Written in {BRAND.origin}</div>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-[color:var(--paper-dim)]">
                Everything here comes out of the same plant the water does. If a number
                looks off to you, tell us on WhatsApp  we would rather correct a post
                than defend it.
              </p>
            </div>
            <button
              type="button"
              onClick={() => open()}
              className="btn-accent inline-flex shrink-0 items-center gap-2.5 px-7 py-4 text-[12px] uppercase tracking-[0.18em]"
              data-testid="post-order-cta"
            >
              Order water
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </GlassPanel>
      </div>

      {/* Keep reading */}
      <section className="relative px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)]">
              Keep <em className="italic ink-accent">reading.</em>
            </h2>
            <div className="rule w-full max-w-xs md:mb-3" />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

/* ── Page ───────────────────────────────────────────────────── */
const Journal = () => {
  const { hash } = useLocation();

  // An unknown slug falls back to the grid rather than a dead end  the hash
  // is user-editable, and a typo should not produce a 404 on a page that has
  // every post on it anyway.
  const post = getPost(decodeURIComponent(hash.replace(/^#/, "")));

  return (
    <div className="relative z-10">
      <Nav />
      <main>
        {/* Keyed on the slug so switching posts from "keep reading" remounts
            the reader  otherwise the entry animations would not replay. */}
        {post ? <Article key={post.slug} post={post} /> : <Index />}
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
};

export default Journal;
