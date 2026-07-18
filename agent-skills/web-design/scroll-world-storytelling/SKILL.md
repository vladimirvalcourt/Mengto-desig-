---
name: scroll-world-storytelling
description: Turn an article, case study, brand narrative, product journey, or long-form story into a cinematic scroll-scrubbed landing page where one continuous visual world advances with scroll. Use when the user asks for a scroll world, fly-through landing page, article-to-website transformation, continuous camera story, immersive scrollytelling, video-scrubbed page, connected diorama journey, or a story-led alternative to ordinary stacked landing-page sections.
---

# Scroll World Storytelling

Convert source material into a clear narrative journey, art-direct one connected world, and make scroll drive its camera or timeline. Preserve the source meaning while changing the presentation from document order to visual beats.

This is more specific than ordinary scroll animation. The visitor should feel like they travel through one place or one uninterrupted take, not watch unrelated sections fade in.

## Start with the contract

Write these three blocks before building:

### Goal

State one finish line in outcome language.

> Turn the supplied story into a one-page journey with 5–7 memorable beats and one final action. A first-time visitor should understand the thesis, tension, proof, and payoff without reading the source.

### House rules

- Preserve the source thesis, sequence, facts, and caveats. Never invent proof.
- Use one connected world, one dominant camera grammar, and one art direction.
- Let motion carry transitions; let copy explain meaning. Do not animate every word.
- Keep one primary CTA. Navigation and utility controls stay visually quiet.
- Never spend generation credits, publish, deploy, or replace production files without approval.
- Keep the builder and verifier separate. Do not accept the builder's own claim that the experience is finished.

### Bar

- A visitor can explain the story arc after one pass.
- No visible jump, flash, rewind, or velocity reversal at scene seams.
- Scrolling works forward, backward, slowly, and with a fast flick.
- The page remains legible on mobile and with reduced motion.
- Every completion claim includes evidence: real browser behavior, console state, responsive checks, and seam screenshots or frame comparisons.

## Inspect before inventing

1. Read the complete source, not only its headline or opening.
2. Inspect the target repo, framework, asset pipeline, and existing page structure.
3. Collect supplied brand assets and 2–3 visual references when available.
4. Separate source facts from presentation ideas.
5. Identify the one action the landing page should earn.

When the source is copyrighted and the user did not provide reuse rights, paraphrase the story beats and keep quotations short. Do not fabricate testimonials, metrics, or customer claims.

## Build the story map

Reduce the source to 5–7 beats. Use this default arc:

1. **Hook** — the promise, world, or surprising thesis.
2. **Old way** — the friction or belief the story rejects.
3. **New rule** — the central idea that changes the route.
4. **Mechanism** — how the system, product, or process works.
5. **Proof** — the strongest evidence, example, or consequence.
6. **Payoff** — the transformed end state.
7. **Action** — one next step.

Create a beat ledger before code:

| Field | Constraint |
| --- | --- |
| id | short, stable slug |
| scene | what physically exists in the world |
| eyebrow | 2–4 words |
| headline | 3–8 words |
| body | one sentence, ideally under 24 words |
| evidence | exact source fact or asset |
| camera move | one clear verb phrase |
| scroll weight | 0.7–1.8 viewport heights |
| CTA | only on the final beat unless required earlier |

Do not map every paragraph to a scene. Combine repeated arguments and give the strongest ideas more scroll distance.

## Write the style bible

Extract or define:

- Mood: three precise adjectives.
- World metaphor: one place that can contain every beat.
- Palette: 4–6 named colors with one dominant field and one accent.
- Typography: one display voice and one reading voice.
- Material language: clay, paper, glass, architectural, photographic, mechanical, or another single system.
- Camera grammar: forward glide, orbit, crane, lateral track, dive, or aerial hop.
- Pacing: where the story pauses and where it moves quickly.
- Exclusions: three visual clichés or template patterns to avoid.

Reuse the style preamble verbatim in every scene-generation prompt. Changing its wording between scenes creates drift even when the meaning looks similar.

## Choose the camera architecture

### A. Continuous forward take

Use for architecture, hospitality, product walkthroughs, processes, factories, campuses, and grounded worlds.

- Start the first leg from the approved opening still.
- Start every later leg from the previous leg's actual rendered last frame.
- Move expressively inside a leg, then settle into the same slow forward drift during its final second.
- Do not force an establishing end frame that makes the camera pull backward.
- Use no connector clips; the legs are the journey.

This is the safest default because position and velocity both continue across seams.

### B. Scene dives plus aerial connectors

Use only when the world is intentionally map-like: miniatures, islands, diagrams, dioramas, or a god's-eye journey.

- Render one dive per beat.
- Extract the dive's actual last frame.
- Extract the next dive's actual first frame.
- Generate the connector with those two rendered frames as its endpoints.
- Use a very short crossfade as insurance, not as a substitute for matching frames.

The connector may pull up and move to the next island. That reversal reads intentional in a miniature world and wrong in a grounded walkthrough.

### C. No-generation prototype

Use for early story approval, zero-budget demos, and interaction testing.

- Build one procedural canvas, SVG, CSS, or WebGL world.
- Map scroll progress to a deterministic camera position.
- Keep the same beat ledger, copy, route rail, pacing, CTA, and accessibility contract.
- Replace the prototype renderer with production media only after the journey is approved.

Use [demo/index.html](demo/index.html) as the portable reference for this mode.

## Plan generation and cost

Before paid generation, show the user:

- Number of scene stills.
- Number and duration of video legs or connectors.
- Desktop-only versus a separately composed 9:16 mobile chain.
- Draft versus final render tier.
- Estimated generation cost plus 15–20% re-roll headroom.
- Which tool or provider will be used.

Get approval before spending. Generate a cheap or short calibration still and clip first when pricing is uncertain.

For production media:

1. Generate all stills from one source/model with one byte-identical style preamble.
2. Review the full contact sheet before video.
3. Re-roll off-style stills before they contaminate the chain.
4. Keep important subjects near the composition center with usable headroom.
5. Generate the chosen camera architecture using local rendered frames for every handoff.
6. Keep raw masters until final QA passes.

If the chosen video model cannot accept the required start frame, or both start and end frames for connectors, it cannot promise seamless output. Choose a frame-locking model or stay in prototype mode.

## Encode for scrubbing

Scroll scrubbing changes video current time repeatedly. Favor seekability, consistent encodes, and small GOPs.

~~~bash
ffmpeg -i source.mp4 -an \
  -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 \
  -movflags +faststart output.mp4
~~~

Defaults:

- Keep the native desktop resolution; do not upscale a smaller render.
- Strip audio.
- Use the same codec and settings across the chain.
- Use a 720-pixel-wide native portrait chain with a smaller GOP for approved mobile renders.
- Load clips through byte-range-capable hosting or fetch them to Blob URLs before scrubbing.
- Keep each first frame as a poster until the video has painted.

## Build the page

Keep content separate from the renderer:

~~~js
const story = {
  title: "The journey",
  cta: { label: "Begin", href: "#begin" },
  sections: [
    {
      id: "hook",
      eyebrow: "01 / The premise",
      title: "A destination, not a route.",
      body: "Define arrival clearly and let the camera find the path.",
      still: "assets/hook.webp",
      clip: "assets/hook.mp4",
      scroll: 1.6,
      linger: 0.35
    }
  ]
};
~~~

The runtime should provide:

- A pinned full-viewport visual stage.
- One scroll conductor that maps document progress to camera/video time.
- Config-driven copy and route navigation.
- Local easing or linger inside a scene without changing its first and last frame.
- RequestAnimationFrame work only while progress is changing.
- Seek coalescing so fast touch scrolling does not queue decoder work.
- Lazy preloading of the current and next clips.
- Static poster fallbacks, keyboard focus, semantic headings, and one real CTA.
- A reduced-motion mode that shows still scenes and ordinary document flow.

Avoid global scroll hijacking. The scrollbar must remain native and reversible.

## Verify with a fresh pass

Use a separate verifier or a fresh context with the goal, rules, bar, and real output. Ask it to find the largest remaining gap, not to praise the build.

Check:

1. **Story** — every beat advances the thesis; no section repeats another.
2. **Seams** — compare just before and after every handoff in both directions.
3. **Camera** — no cross-seam velocity reversal unless it is an intentional diorama hop.
4. **Playback** — progress changes the expected clip time; no frame-zero freeze.
5. **Performance** — no perpetual animation loop after scroll settles.
6. **Responsive** — verify 390, 768, 1024, and 1440 pixel widths.
7. **Mobile** — fast flick, orientation change, safe areas, poster-to-video handoff.
8. **Accessibility** — keyboard path, visible focus, contrast, semantic order, reduced motion.
9. **Integrity** — every factual claim matches the source and every CTA works.
10. **Console** — no errors or failed assets.

Repeat: build, verify, close the largest gap. Stop when the verifier has no material gap against the bar.

## Deliverables

Return:

- Story map and final beat ledger.
- Style bible and generation prompts.
- Working page and reusable story configuration.
- Local assets with source and license notes when applicable.
- Desktop and approved mobile behavior.
- Verification evidence and any known limitations.

Read [demo/PROMPT.md](demo/PROMPT.md) when the user wants the exact standalone demo contract or a remix prompt. Keep [REFERENCES.md](REFERENCES.md) as the external reading list.
