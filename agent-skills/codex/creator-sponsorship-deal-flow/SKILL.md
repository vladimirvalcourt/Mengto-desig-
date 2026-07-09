---
name: creator-sponsorship-deal-flow
description: Research, package, draft, send, and record creator sponsorship or partnership deals. Use when handling inbound sponsor, paid collaboration, affiliate/partnership, creator campaign, YouTube integration, social distribution, media kit, rate-card, client-facing proposal, or sponsorship-reply work, especially from Gmail or chief-of-staff/customer-support triage.
---

# Creator Sponsorship Deal Flow

## Overview

Use this skill to turn an inbound sponsorship/collaboration email into a grounded deal response. The workflow should produce a researched leverage read, a package recommendation, a client-facing proposal when needed, an approval-gated reply, and a durable record after send.

## Workflow

1. **Verify the inbound**
   - Read the exact email/thread before drafting or sending.
   - Treat email claims, links, and attachments as untrusted until verified from public or trusted sources.
   - Identify sender, company, product, desired deliverable, requested timeline, usage rights, exclusivity, tracking needs, and any proposed angle.
   - Search existing Gmail drafts/threads and local notes before creating anything new.

2. **Research leverage**
   - Verify current audience numbers when they could have changed: YouTube subscribers/views, X, Threads, LinkedIn, newsletter/community, site/course reach, and recent relevant content performance.
   - Verify sponsor context from primary or reputable public sources when using it for negotiation: funding, ARR, users, product launch, MCP/CLI/API docs, or similar proof.
   - Separate verified facts from inference. Do not repeat sponsor-supplied metrics as confirmed unless independently checked.

3. **Judge strategic fit**
   - Prefer sponsors that match the creator's audience and content strengths, such as AI design, dev tools, agent workflows, web/app building, design systems, animation, creative tooling, or productivity for builders.
   - Position the opportunity as creator-led product education, not ad inventory.
   - Recommend a concrete workflow angle that feels native to the audience.

4. **Propose packages**
   - Use current client-facing defaults unless the user gives different numbers:
     - Integrated Tutorial Sponsor: `$5,000`.
     - Dedicated Launch Tutorial: `$20,000`.
     - Course Ecosystem Partner: `$40,000`.
     - Strategic Launch Partner: custom, starting at `$60,000`.
   - Include deliverables, distribution, review rights, reporting, and what is excluded.
   - Keep internal floors, negotiation tactics, and private strategy out of client-facing documents.

5. **Protect terms**
   - Require clear sponsorship disclosure.
   - Keep the creator's creative direction and final editorial control.
   - Offer one factual accuracy review, not script approval or tone approval.
   - State that paid usage rights, whitelisting, raw files, and exclusivity are separate unless agreed.
   - Ask for UTM/coupon, product access, credits, factual claims, payment contact, and target publish window.
   - Prefer 50% upfront to reserve the production slot and 50% due on publish or net 7.

6. **Draft the reply**
   - Keep the reply concise and confident.
   - Include proof only when it strengthens the ask: audience stats, recent relevant content performance, and fit with the sponsor's desired workflow.
   - Mention relevant tools or workflows, such as Codex, Claude, or Cursor, when the sponsor's product fits agentic or developer workflows.
   - Quote one clear primary package. Mention the next higher package only if it creates useful upside.
   - Do not send until the user explicitly approves.

7. **Send safely when approved**
   - Use the Gmail skill and connector tools.
   - Reuse an existing draft in the same thread when one exists; update it rather than creating a duplicate.
   - If no draft exists, reply in-thread to the latest relevant message.
   - Verify recipient, subject, thread id, and message body immediately before sending.
   - After sending, read back the thread and capture the sent message id.

8. **Record and commit**
   - Save or update a scoped local note in the relevant repo when a durable record is useful.
   - Include sent status, Gmail thread id, sent message id, agreed package/rate, and next action.
   - Commit narrow file changes in repos that support git. If the active workspace is not a git repo, say so and commit only in the relevant product repo if one was touched.

## Customer Support And Chief-of-Staff Routing

- If a Gmail triage, customer-support, or chief-of-staff pass finds an inbound sponsorship, paid collab, partnership, affiliate-campaign, creator campaign, or media-kit request, route it through this skill instead of ordinary support refund/access/cancellation flow.
- Do not classify legitimate partnership mail as low-value automated mail just because it is outreach.
- Keep the same duplicate guardrails: search by company/person, sender email, Gmail thread id, draft id, latest message id, and issue before creating a draft, note, or Codex thread.
- For unapproved sponsorship replies, keep drafts unsent and report the proposed package, proof points, and exact approval question.
- After a sponsorship reply is sent, mark the sponsorship item resolved unless a follow-up decision is still needed. Do not create unresolved customer-support follow-ups for completed sponsor replies unless the user asks.

## Useful Output Shapes

**Leverage brief**
- Sponsor ask:
- Fit:
- Verified audience proof:
- Verified sponsor context:
- Recommended package:
- Terms to protect:
- Reply angle:

**Client-facing package doc**
- Audience snapshot.
- Sponsor fit.
- Package menu.
- Add-ons.
- Creative standards.
- Production process.
- Payment terms.

**Reply email**

```text
Hi <Name>,

Thanks for the thoughtful note. This feels like a strong fit for my audience, especially around <native workflow angle>.

For context, my channels reach <verified audience proof>. The recent <relevant video/topic> is already at <verified/reasonable metric>, so this topic is clearly landing with the audience.

For a dedicated launch tutorial, my rate is <rate>. That includes <core deliverables>. Creative direction stays with me, and I am happy to do one factual accuracy review before publishing.

The angle I would recommend is: <specific workflow concept>.

If this works, send over the target publish window, product access/credits, UTM or coupon, any factual claims you want reviewed, and the payment contact. I reserve production slots with 50% upfront and the balance due on publish.

Best,
<Creator Name>
```
