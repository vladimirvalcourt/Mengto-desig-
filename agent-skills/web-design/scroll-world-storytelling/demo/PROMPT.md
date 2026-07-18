# Scroll World Storytelling Demo Prompts

## Minimal prompt

Use $scroll-world-storytelling to turn this article, case study, or narrative into a polished scroll-world landing page with a clear story map, one connected visual journey, and one final CTA.

## Recreate the demo

Use $scroll-world-storytelling to build a responsive standalone HTML demo titled The Contract.

### Goal

Turn the idea goal + rules + bar into a six-chapter cinematic journey. Scroll should move a camera through one continuous procedural world while the copy progresses from destination to verification.

### House rules

- Create demo/index.html as one standalone document with inline CSS and JavaScript.
- Use no framework, package manager, network request, external asset, font download, or build step.
- Render the world with one full-viewport canvas; keep native document scrolling.
- Use six chapters: Destination, Fence, Bar, Loop, Route, Proof.
- Give every chapter an eyebrow, short headline, one-sentence body, and distinct scene color.
- Keep a compact route rail, progress meter, chapter counter, scroll cue, replay control, and one final CTA.
- Map scroll deterministically to camera depth. Scrolling backward must reverse the journey cleanly.
- Run requestAnimationFrame only while easing toward a new scroll target; stop when settled.
- Keep the page usable with JavaScript disabled, keyboard navigation, visible focus, and reduced motion.
- On mobile, place copy above a restrained bottom scrim and keep controls clear of safe areas.

### Art direction

Use a dark editorial field-manual aesthetic: near-black navy, warm parchment type, signal amber, electric cyan, coral, and acid green. Pair a narrow technical sans stack with a high-contrast old-style serif. The memorable visual is a chain of luminous portals, monoliths, route lines, and particles projected in perspective as the camera moves forward.

### Bar

- The experience works from 390px through 1440px without clipped copy or overlapping controls.
- All six story beats become active at the correct scroll positions.
- Canvas resolution stays crisp at device pixel ratio without exceeding 2x.
- Replay returns to the beginning and focus remains visible.
- Reduced motion removes easing and decorative transitions while preserving every chapter.
- The console has no errors and there are no failed asset requests.

## Remix prompt

Use $scroll-world-storytelling and keep the same implementation and verification contract, but replace The Contract with my supplied story. First return the 5–7 beat ledger and style bible. Then build the standalone scroll world using the approved beats, world metaphor, palette, camera grammar, proof, and CTA. Preserve native reversible scrolling, reduced motion, responsive behavior, the settled animation loop, and the independent verification pass.
