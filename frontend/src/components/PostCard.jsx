import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatDate, readingMinutes } from "@/lib/journal";

/**
 * Journal card  one post in the /journal grid.
 *
 * The whole journal lives on the single /journal route, so opening a post is a
 * hash change rather than a navigation: `/journal#slug` swaps the grid for
 * that post's expanded view. Going through the router (rather than a bare
 * anchor) is what keeps the back button working and the link shareable.
 *
 * Deliberately not a GlassPanel: the photo is the surface here, and stacking a
 * live SVG-filter panel behind an image that already covers it buys nothing
 * and costs a filter pass per card.
 */
const PostCard = ({ post, className = "" }) => (
  <Link
    to={`/journal#${post.slug}`}
    className={`group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#4fd1e3]/40 hover:bg-white/[0.07] ${className}`}
    data-testid={`post-card-${post.slug}`}
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <img
        src={post.image}
        alt={post.imageAlt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040c13] via-[#040c13]/25 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#04121a]/70 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
        {post.category}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-7">
      <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-[color:var(--paper-faint)]">
        <span>{formatDate(post.date)}</span>
        <span className="h-1 w-1 rotate-45 bg-[#4fd1e3]" />
        <span>{readingMinutes(post)} min read</span>
      </div>

      <h3 className="font-display mt-4 text-[22px] leading-tight transition-colors duration-300 group-hover:text-[#8df0c0]">
        {post.title}
      </h3>

      <p className="mt-3.5 flex-1 text-[14px] leading-relaxed text-[color:var(--paper-dim)]">
        {post.excerpt}
      </p>

      <span className="mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#4fd1e3]">
        Read
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>
  </Link>
);

export default PostCard;
