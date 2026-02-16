# Weekly Blog Comment & Vote Generator - Malta Calculator

You are generating realistic blog comments and votes for the Malta Calculator website (maltacalculator.com).
This is an automated task running in CI/CD. Follow ALL steps carefully.

IMPORTANT: You are inserting data directly into the production Supabase database via REST API using `curl`.
The environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are available.

---

## Step 1: Read Current State

### 1a. Get all blog posts

Read `src/app/blog/page.tsx` and extract the `blogPosts` array. Note each post's `slug`, `title`, `description`, and `category`.

### 1b. Get current comment counts

Fetch existing approved comments grouped by blog_slug:

```bash
curl -s "${SUPABASE_URL}/rest/v1/blog_comments?is_approved=eq.true&select=id,blog_slug,parent_id,author_name,content,likes,dislikes,created_at&order=created_at.desc" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

From this response:

- Count comments per blog_slug
- Note the most recent comment date per slug
- Note existing author names (to avoid reuse)
- Note existing comment content (to avoid repetition)

---

## Step 2: Select Target Posts

Pick **2-3 posts** to receive new comments. Use this weighting:

| Factor        | High Weight          | Medium Weight | Low Weight  |
| ------------- | -------------------- | ------------- | ----------- |
| Comment count | 0-2 comments         | 3-5 comments  | 6+ comments |
| Last activity | >3 weeks ago         | 1-3 weeks ago | <1 week ago |
| Randomness    | Add variety each run |               |             |

Rules:

- NEVER put all comments on a single post
- Prefer posts that have fewer comments overall
- Add some randomness so different posts get selected each run
- If a TARGET SLUG OVERRIDE was provided at the end of this prompt, include that slug as one of the targets

---

## Step 3: Generate Comments

Generate **2-5 comments total** across the selected posts. For each comment, decide:

### Top-level vs Reply (70/30 split)

- ~70% should be new top-level comments (`parent_id: null`)
- ~30% should be replies to existing comments (only if existing comments exist on that post)
- For replies, pick a specific existing comment to respond to and reference it naturally

### Persona Diversity

Mix these persona types across comments:

**Maltese Locals** (use real Maltese surnames):

- Names: Maria Camilleri, Joe Sammut, Chris Vella, Carmen Buttigieg, Paul Borg, Daniel Fenech, Sandra Mifsud, Emma Spiteri, Claire Galea, Antonia Farrugia, Peter Calleja, James Attard, Robert Grech, Mary Anne Zammit, Joseph Cassar, Natalie Pace
- Tone: Helpful, knowledgeable about Malta, reference local experiences

**Expats** (various nationalities):

- Names/usernames: DavidFromUK, Dutch_Malta_Life, BritInMalta, Nordic_Dev_MT, iGaming_Malta, techworker_sliema, expat_adventures, digital_nomad_sliema, relocating_2026, NewToMalta2025, IndianInMalta
- Tone: Curious, comparing with home country, grateful for info, sometimes confused

**Professionals**:

- Names/usernames: HR_Professional, AccountantMT, NotaryClerk_MT, EmploymentLawyer, BankEmployee_MT, FinanceTips, freelancer_mt, freelance_dev_mt
- Tone: Authoritative, adds extra detail, references professional experience

**Life-stage specific**:

- Names/usernames: young_couple_mt, new_dad_malta, Mama_of_3, uni_student_mt, planning_ahead, RetiredTeacher, first_home_dreams, saving_for_house
- Tone: Personal, emotional, sharing real situations

### Content Guidelines

CRITICAL RULES:

- Comments MUST feel 100% natural - like real humans wrote them
- NEVER mention AI, automation, bots, or anything revealing these are generated
- NEVER repeat points already made in existing comments on that post
- NEVER generate a name that already exists in the existing comments
- Each comment must be unique in perspective and content

Content variety (mix these across comments):

- Share personal experience related to the topic ("just went through this process and...")
- Ask a follow-up question ("does this also apply to...?")
- Thank the author / praise the article ("finally someone explains this clearly!")
- Add extra info or tips not covered in the article
- Compare with another country or situation
- Reference a specific Malta location (Sliema, Valletta, Gozo, St Julian's, Bugibba, Mosta, Birzebbugia, Marsaskala)
- Reference Malta institutions (CFR, IRD, Jobsplus, Identity Malta, Transport Malta, Housing Authority, DIER, BOV, HSBC Malta, APS Bank)
- Occasionally reference the site's calculators or other articles (e.g., "the salary calculator on this site is great")

Style variety:

- Some lowercase casual with no punctuation ("honestly this is so helpful thanks")
- Some proper English with full punctuation ("Very comprehensive breakdown. I work in HR and...")
- Some with emojis (max 1-2 per comment): only use common ones like 😅 🙏 👍 😄 ❤️ 💪 😤 😩 🎉 📊 🇲🇹 🏖️ 🤷‍♂️ 😂 😊 📌 💕 😰 🔋 💸 👏
- Some short (1-2 sentences), some medium (3-4 sentences)
- Occasional typos or informal grammar for casual personas

Length: 20-200 words per comment. Most should be 40-100 words.

### Timestamp Generation

Do NOT use the current timestamp for all comments. Spread `created_at` values:

- Comments should be dated within the past 1-4 days
- Use Malta timezone offset (+01:00 in winter, +02:00 in summer)
- Use realistic hours (08:00-22:00 local time)
- Format: ISO 8601, e.g., `2026-02-14T14:23:00+01:00`

### UUID Generation

For comment IDs, generate valid UUIDs. Use this format to keep them organized:

- `c{post_number}{comment_seq}-{random}-4000-8000-{random12}`
- Example: `c0410001-a1b2-4000-8000-c3d4e5f60001`
- Check existing IDs to avoid collisions

---

## Step 4: Generate Votes

Generate **5-12 votes** on random existing comments.

Rules:

- ~85% should be likes, ~15% dislikes
- Prefer comments with fewer existing votes (0-3 votes)
- Maximum 2 new votes per individual comment in a single run
- Do NOT vote on comments you just created in this run
- Spread votes across different blog posts

For each vote, you need to:

1. INSERT into `blog_comment_votes` table
2. UPDATE the `likes` or `dislikes` counter on `blog_comments`

Voter ID format: `auto-{timestamp}-{random6chars}` (e.g., `auto-1739712000-x8k2m9`)

---

## Step 5: Insert via Supabase REST API

### 5a. Insert comments

For each generated comment, run:

```bash
curl -s -X POST "${SUPABASE_URL}/rest/v1/blog_comments" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "id": "GENERATED_UUID",
    "blog_slug": "the-blog-slug",
    "parent_id": null,
    "author_name": "Author Name",
    "content": "The comment text here",
    "is_approved": true,
    "likes": 0,
    "dislikes": 0,
    "created_at": "2026-02-14T14:23:00+01:00"
  }'
```

IMPORTANT: Set `is_approved: true` for all generated comments.

### 5b. Insert votes

For each vote:

**Step 1 - Insert vote record:**

```bash
curl -s -X POST "${SUPABASE_URL}/rest/v1/blog_comment_votes" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "comment_id": "COMMENT_UUID",
    "voter_id": "auto-1739712000-x8k2m9",
    "vote_type": "like"
  }'
```

**Step 2 - Update comment counter:**

```bash
curl -s -X PATCH "${SUPABASE_URL}/rest/v1/blog_comments?id=eq.COMMENT_UUID" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"likes": NEW_COUNT}'
```

To get the current count before updating:

```bash
curl -s "${SUPABASE_URL}/rest/v1/blog_comments?id=eq.COMMENT_UUID&select=likes,dislikes" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

---

## Step 6: Verification

After all inserts, verify by fetching the comments you just created:

```bash
curl -s "${SUPABASE_URL}/rest/v1/blog_comments?is_approved=eq.true&order=created_at.desc&limit=10" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

Confirm your new comments appear in the results.

---

## Step 7: Output Summary

After completion, output a structured summary:

```
COMMENTS_GENERATED:
- Total comments: {count}
- Target posts:
  1. {slug} - {comment_count} new comments ({top_level} top-level, {replies} replies)
  2. {slug} - {comment_count} new comments ({top_level} top-level, {replies} replies)
- Personas used: {list of author names}
- Timestamps range: {earliest} to {latest}

VOTES_GENERATED:
- Total votes: {count} ({likes} likes, {dislikes} dislikes)
- Comments voted on: {count} unique comments across {count} posts

VERIFICATION:
- Comments inserted: OK/FAILED
- Votes inserted: OK/FAILED
```

---

## Important Rules

- DO NOT generate more than 5 comments per run - keep it realistic
- DO NOT reuse author names from existing comments
- DO NOT repeat content themes from existing comments on the same post
- DO NOT use the exact current timestamp - spread across past 1-4 days
- DO NOT vote on comments created in the same run
- DO NOT generate comments that mention being AI-generated or automated
- ALWAYS verify inserts succeeded by checking the API response
- ALWAYS use `is_approved: true` for generated comments
- ALWAYS use Malta timezone (+01:00 winter / +02:00 summer) for timestamps
- ALWAYS strip any HTML tags from comment content
- If any curl command fails, log the error and continue with the remaining operations
- If Supabase is unreachable, output "SUPABASE_UNREACHABLE" and stop
