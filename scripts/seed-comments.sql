-- Blog Comments Seed Data
-- Gercekci, insan gibi yorumlar - SEO icin onemli
-- Her post icin farkli sayida yorum, replies ve vote'lar

-- ===========================================
-- 1. malta-property-transfer-tax-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0010001-0001-4000-8000-000000000001', 'malta-property-transfer-tax-guide-2026', NULL, 'Sarah M.', 'Finally someone explains this properly! We''re buying our first apartment in Sliema and the stamp duty calculations were so confusing. This breakdown really helped us budget for the extra costs 🙏', true, 7, 0, '2026-01-18 09:23:00+01'),
('c0010001-0001-4000-8000-000000000002', 'malta-property-transfer-tax-guide-2026', NULL, 'DavidFromUK', 'moved to malta last year and had no idea about the 5% duty on property transfers. wish i found this before signing. anyone know if the rate changes for gozo properties?', true, 4, 0, '2026-01-20 14:45:00+01'),
('c0010001-0001-4000-8000-000000000003', 'malta-property-transfer-tax-guide-2026', 'c0010001-0001-4000-8000-000000000002', 'Maria Camilleri', 'Same rate for Gozo David, but there are some special schemes for first time buyers in Gozo that give reduced rates. worth checking with a notary!', true, 3, 0, '2026-01-20 16:12:00+01'),
('c0010001-0001-4000-8000-000000000004', 'malta-property-transfer-tax-guide-2026', NULL, 'Alex & Joanna', 'super useful guide. bookmarked it for when we start our property search next month. the calculator links are a nice touch too 👍', true, 5, 0, '2026-01-25 11:30:00+01');

-- ===========================================
-- 2. malta-budget-2026-family-tax-savings-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0020001-0001-4000-8000-000000000001', 'malta-budget-2026-family-tax-savings-guide', NULL, 'Chris Vella', 'The tax band changes are great news for families. We have 2 kids and looks like we''ll save around €400 this year compared to last year. Every bit helps with the cost of living going up!', true, 12, 0, '2026-01-15 08:15:00+01'),
('c0020001-0001-4000-8000-000000000002', 'malta-budget-2026-family-tax-savings-guide', NULL, 'mamta_adventures', 'as a single parent this is really helpful to see whats changed. the children allowance increase is welcome but honestly still not enough with rent prices in malta these days 😅', true, 9, 1, '2026-01-16 19:30:00+01'),
('c0020001-0001-4000-8000-000000000003', 'malta-budget-2026-family-tax-savings-guide', NULL, 'Robert Grech', 'Very comprehensive breakdown. I work in HR and will be sharing this with our employees. The salary calculator on this site is also fantastic btw', true, 6, 0, '2026-01-19 10:45:00+01'),
('c0020001-0001-4000-8000-000000000004', 'malta-budget-2026-family-tax-savings-guide', 'c0020001-0001-4000-8000-000000000001', 'Diane P.', 'same here Chris! family of 4 and the new brackets definitely help. did you also check the in-work benefit changes?', true, 3, 0, '2026-01-17 12:20:00+01'),
('c0020001-0001-4000-8000-000000000005', 'malta-budget-2026-family-tax-savings-guide', NULL, 'maltaexpat2024', 'Been living here 2 years now and this site is honestly my go-to for anything tax related in Malta. Keep up the good work! 🇲🇹', true, 8, 0, '2026-01-22 15:10:00+01');

-- ===========================================
-- 3. malta-public-holidays-2026-complete-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0030001-0001-4000-8000-000000000001', 'malta-public-holidays-2026-complete-guide', NULL, 'Jenny Liu', 'love that some holidays fall on fridays this year!! already planning a few long weekend trips to gozo 🏖️', true, 11, 0, '2026-01-10 16:40:00+01'),
('c0030001-0001-4000-8000-000000000002', 'malta-public-holidays-2026-complete-guide', NULL, 'Marco B.', 'Useful list, thanks. Quick question - do part time workers get the same public holidays or is it pro-rated?', true, 5, 0, '2026-01-12 09:55:00+01'),
('c0030001-0001-4000-8000-000000000003', 'malta-public-holidays-2026-complete-guide', 'c0030001-0001-4000-8000-000000000002', 'AdminHelper', 'Part timers get public holidays pro-rated based on their working hours Marco. So if you work 20hrs/week you get half.', true, 7, 0, '2026-01-12 14:20:00+01'),
('c0030001-0001-4000-8000-000000000004', 'malta-public-holidays-2026-complete-guide', NULL, 'NomadInMalta', 'lol 14 public holidays is crazy compared to where i come from (US - we barely get 10). One of the perks of malta life i guess 😄', true, 15, 0, '2026-01-14 20:00:00+01');

-- ===========================================
-- 4. malta-tax-rates-2026-complete-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0040001-0001-4000-8000-000000000001', 'malta-tax-rates-2026-complete-guide', NULL, 'James Attard', 'This is the clearest tax rate explanation I''ve seen anywhere. The tables make it so easy to understand which bracket you fall into. Much better than the CFR website honestly', true, 14, 0, '2026-01-08 11:30:00+01'),
('c0040001-0001-4000-8000-000000000002', 'malta-tax-rates-2026-complete-guide', NULL, 'anna_mt', 'can someone explain why married couples with no kids pay more tax than parents?? seems unfair tbh', true, 6, 2, '2026-01-10 17:45:00+01'),
('c0040001-0001-4000-8000-000000000003', 'malta-tax-rates-2026-complete-guide', 'c0040001-0001-4000-8000-000000000002', 'Paul Borg', 'It''s because the parent rates are meant to support child-rearing costs Anna. The government gives incentives for families with children. It''s been like this for years.', true, 8, 0, '2026-01-11 08:10:00+01'),
('c0040001-0001-4000-8000-000000000004', 'malta-tax-rates-2026-complete-guide', NULL, 'techworker_sliema', 'the 35% bracket kicking in at €60k for single people is rough. combined with SSC thats a big chunk of salary gone. at least the first €9.1k is tax free 🤷‍♂️', true, 10, 1, '2026-01-13 13:20:00+01'),
('c0040001-0001-4000-8000-000000000005', 'malta-tax-rates-2026-complete-guide', NULL, 'Lisa M. Williams', 'Shared this with my whole team at work. We''re all expats and nobody could figure out the tax system until now. The salary calculator tool is amazing too!!', true, 9, 0, '2026-01-16 10:00:00+01');

-- ===========================================
-- 5. malta-ssc-contributions-2026-explained
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0050001-0001-4000-8000-000000000001', 'malta-ssc-contributions-2026-explained', NULL, 'Daniel Fenech', 'Finally understand the difference between class 1 and class 2 SSC. My employer was deducting the wrong amount and I would never have noticed without this guide!', true, 8, 0, '2026-01-14 09:00:00+01'),
('c0050001-0001-4000-8000-000000000002', 'malta-ssc-contributions-2026-explained', NULL, 'freelancer_mt', 'the SSC cap at €559.31/week is important info. i was overpaying as self-employed because my accountant wasn''t applying it correctly 😤', true, 6, 0, '2026-01-17 15:30:00+01'),
('c0050001-0001-4000-8000-000000000003', 'malta-ssc-contributions-2026-explained', NULL, 'Rachel K.', 'Good article. Does anyone know if SSC paid in Malta counts towards pension in another EU country? Moving back to Ireland next year and worried about losing contributions.', true, 4, 0, '2026-01-21 11:15:00+01');

-- ===========================================
-- 6. understanding-cola-malta-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0060001-0001-4000-8000-000000000001', 'understanding-cola-malta-2026', NULL, 'Joe Sammut', 'wait so COLA is different in Q1/Q3 vs Q2/Q4? never knew that. explains why my payslip amounts change slightly between quarters', true, 7, 0, '2026-01-12 08:30:00+01'),
('c0060001-0001-4000-8000-000000000002', 'understanding-cola-malta-2026', NULL, 'expat_adventures', 'honestly €5.84/week COLA increase doesn''t even cover the rise in grocery prices this year lol. but at least now i understand how its calculated', true, 11, 0, '2026-01-15 19:45:00+01'),
('c0060001-0001-4000-8000-000000000003', 'understanding-cola-malta-2026', 'c0060001-0001-4000-8000-000000000001', 'Mary Anne Zammit', 'Yes Joe! Q2 and Q4 include the government bonus weeks so the COLA amount is slightly higher. This article explains it really well.', true, 4, 0, '2026-01-13 10:00:00+01'),
('c0060001-0001-4000-8000-000000000004', 'understanding-cola-malta-2026', NULL, 'StudentMalta', 'this is the first time i actually understand what COLA means 😂 always saw it on payslips but never bothered to look it up. thanks for the simple explanation!', true, 5, 0, '2026-01-19 14:20:00+01');

-- ===========================================
-- 7. malta-expat-tax-hqp-scheme-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0070001-0001-4000-8000-000000000001', 'malta-expat-tax-hqp-scheme-guide', NULL, 'Michael S.', 'Got approved for HQP last year and its been great. 15% flat rate saves me thousands compared to the regular tax brackets. Definitely worth applying if you qualify', true, 9, 0, '2026-01-11 12:00:00+01'),
('c0070001-0001-4000-8000-000000000002', 'malta-expat-tax-hqp-scheme-guide', NULL, 'iGaming_Malta', 'this is essential reading for anyone in the gaming industry here. most of us qualify for HQP and the savings are significant. great guide 👏', true, 7, 0, '2026-01-14 16:30:00+01'),
('c0070001-0001-4000-8000-000000000003', 'malta-expat-tax-hqp-scheme-guide', NULL, 'NewToMalta2025', 'My company is relocating me to Malta. Does anyone know how long the HQP application takes? And can my spouse also benefit from it?', true, 3, 0, '2026-01-18 09:15:00+01'),
('c0070001-0001-4000-8000-000000000004', 'malta-expat-tax-hqp-scheme-guide', 'c0070001-0001-4000-8000-000000000003', 'Michael S.', 'took about 3 weeks for mine. And no your spouse has their own tax status unless they also qualify independently. Talk to your HR they usually handle the paperwork', true, 5, 0, '2026-01-18 14:45:00+01');

-- ===========================================
-- 8. malta-minimum-wage-2026-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0080001-0001-4000-8000-000000000001', 'malta-minimum-wage-2026-guide', NULL, 'workers_rights_mt', '€213.54/week is still very low considering how expensive malta has become. rent alone takes most of that in many areas. hope the government increases it more next year', true, 13, 1, '2026-01-09 18:00:00+01'),
('c0080001-0001-4000-8000-000000000002', 'malta-minimum-wage-2026-guide', NULL, 'Sandra Mifsud', 'Thanks for including the monthly and annual breakdown. I always get confused converting weekly to monthly. Very helpful resource!', true, 6, 0, '2026-01-13 11:30:00+01'),
('c0080001-0001-4000-8000-000000000003', 'malta-minimum-wage-2026-guide', NULL, 'part_timer_gozo', 'does minimum wage apply the same way for part timers? like if i work 20 hours do i get half of this?', true, 3, 0, '2026-01-16 14:00:00+01');

-- ===========================================
-- 9. malta-part-time-employment-rights
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0090001-0001-4000-8000-000000000001', 'malta-part-time-employment-rights', NULL, 'Claire Galea', 'I work part-time and my employer was trying to deny me sick leave. Showed them this article and they backed down immediately. Know your rights people! 💪', true, 16, 0, '2026-01-11 10:20:00+01'),
('c0090001-0001-4000-8000-000000000002', 'malta-part-time-employment-rights', NULL, 'uni_student_mt', 'really useful for students working part time. didnt know we had the same protection as full timers (just pro-rated). my boss at the restaurant should read this lol', true, 8, 0, '2026-01-14 20:15:00+01'),
('c0090001-0001-4000-8000-000000000003', 'malta-part-time-employment-rights', NULL, 'HR_Professional', 'Well written article. I''d add that part-time employees also have the right to request a change to full-time if a position becomes available. Many employers don''t communicate this.', true, 10, 0, '2026-01-18 09:00:00+01'),
('c0090001-0001-4000-8000-000000000004', 'malta-part-time-employment-rights', 'c0090001-0001-4000-8000-000000000001', 'Jesmond', 'good for you Claire! too many employers take advantage of part timers not knowing their rights', true, 5, 0, '2026-01-12 08:30:00+01');

-- ===========================================
-- 10. malta-maternity-leave-2026-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0100001-0001-4000-8000-000000000001', 'malta-maternity-leave-2026-guide', NULL, 'Emma Spiteri', '18 weeks is decent but still less than many EU countries. At least the first 14 weeks are fully paid. This guide helped me plan everything with my employer before my due date ❤️', true, 10, 0, '2026-01-13 11:00:00+01'),
('c0100001-0001-4000-8000-000000000002', 'malta-maternity-leave-2026-guide', NULL, 'expecting_mom_23', 'omg thank you for this!! im 6 months pregnant and my employer hasnt told me anything about my entitlements. now i know exactly what to ask for', true, 8, 0, '2026-01-16 15:30:00+01'),
('c0100001-0001-4000-8000-000000000003', 'malta-maternity-leave-2026-guide', NULL, 'Mark Pace', 'Any info on paternity leave? My wife is expecting and I know there have been changes recently but cant find clear info anywhere', true, 4, 0, '2026-01-20 09:45:00+01');

-- ===========================================
-- 11. malta-13th-month-salary-bonus-explained
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0110001-0001-4000-8000-000000000001', 'malta-13th-month-salary-bonus-explained', NULL, 'Giovanni R.', 'Coming from Italy where 13th month is common, was surprised Malta has a similar system. The government bonus being split into June and December makes sense', true, 5, 0, '2026-01-10 13:20:00+01'),
('c0110001-0001-4000-8000-000000000002', 'malta-13th-month-salary-bonus-explained', NULL, 'confused_newbie', 'so wait... the "bonus" is actually mandated by law?? i thought my company was just being nice 😂 this explains why everyone gets it', true, 12, 0, '2026-01-14 18:00:00+01'),
('c0110001-0001-4000-8000-000000000003', 'malta-13th-month-salary-bonus-explained', 'c0110001-0001-4000-8000-000000000002', 'AccountantMT', 'Haha yes its mandatory! Government bonus (€135.10 in 2026) plus weekly allowance. Your employer must pay it by law. Check your June and December payslips.', true, 7, 0, '2026-01-15 09:30:00+01'),
('c0110001-0001-4000-8000-000000000004', 'malta-13th-month-salary-bonus-explained', NULL, 'Sasha_Malta', 'useful breakdown. i always wondered why my december pay was different from other months. now it all makes sense!', true, 4, 0, '2026-01-19 16:45:00+01');

-- ===========================================
-- 12. malta-tax-refund-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0120001-0001-4000-8000-000000000001', 'malta-tax-refund-guide-2026', NULL, 'Peter Calleja', 'Got my tax refund last year after following similar advice. Was about €380 back - not huge but hey free money right? 😄 Just make sure to file early', true, 9, 0, '2026-01-11 10:00:00+01'),
('c0120001-0001-4000-8000-000000000002', 'malta-tax-refund-guide-2026', NULL, 'Laura B.', 'How long does the refund actually take? Filed mine in March last year and still waiting in August. The IRD website had no status update at all...', true, 5, 1, '2026-01-15 14:20:00+01'),
('c0120001-0001-4000-8000-000000000003', 'malta-tax-refund-guide-2026', 'c0120001-0001-4000-8000-000000000002', 'Peter Calleja', 'Laura mine took about 4-5 months. Friend of mine waited 8 months though. It varies a lot unfortunately. Keep checking!', true, 3, 0, '2026-01-15 16:10:00+01');

-- ===========================================
-- 13. malta-self-employment-tax-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0130001-0001-4000-8000-000000000001', 'malta-self-employment-tax-guide-2026', NULL, 'freelance_dev_mt', 'been self-employed for 3 years in malta and this is the best summary ive found. the provisional tax payments catch a lot of people off guard in their first year. plan ahead!!', true, 8, 0, '2026-01-12 11:30:00+01'),
('c0130001-0001-4000-8000-000000000002', 'malta-self-employment-tax-guide-2026', NULL, 'Antonia Farrugia', 'Great guide. One thing to add - if you''re self-employed and your income is under €35,000 you might want to look at the micro-invest scheme for tax credits. Saved me quite a bit last year.', true, 11, 0, '2026-01-16 08:45:00+01'),
('c0130001-0001-4000-8000-000000000003', 'malta-self-employment-tax-guide-2026', NULL, 'digital_nomad_sliema', 'just moved from remote employee to self-employed contractor. the SSC change from Class 1 to Class 2 was a shock 💸 helpful to see it all broken down here', true, 6, 0, '2026-01-20 17:00:00+01'),
('c0130001-0001-4000-8000-000000000004', 'malta-self-employment-tax-guide-2026', NULL, 'MaltaBiz', 'Would recommend anyone going self-employed to get a proper accountant. The tax system isnt complicated but the deadlines and provisional payments can trip you up. This guide is a great starting point tho 👍', true, 7, 0, '2026-01-23 12:15:00+01');

-- ===========================================
-- 14. malta-rental-income-tax-15-percent-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0140001-0001-4000-8000-000000000001', 'malta-rental-income-tax-15-percent-guide', NULL, 'landlord_valletta', 'the 15% flat rate is honestly one of the best things about property investment in malta. So much simpler than adding it to your income and paying progressive rates', true, 7, 0, '2026-01-14 09:30:00+01'),
('c0140001-0001-4000-8000-000000000002', 'malta-rental-income-tax-15-percent-guide', NULL, 'Natalie C.', 'Question - if I rent out a room in my apartment (not the whole thing), do I still qualify for the 15% flat rate? Or is it different for partial rentals?', true, 3, 0, '2026-01-18 13:00:00+01'),
('c0140001-0001-4000-8000-000000000003', 'malta-rental-income-tax-15-percent-guide', NULL, 'InvestorMT', 'Good article. Worth noting you need to register the lease with the Housing Authority to qualify for the 15% rate. Some people forget this step and end up paying more.', true, 9, 0, '2026-01-22 10:20:00+01');

-- ===========================================
-- 15. malta-first-time-buyer-scheme-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0150001-0001-4000-8000-000000000001', 'malta-first-time-buyer-scheme-2026', NULL, 'young_couple_mt', 'we just bought our first property using this scheme!! saved us over €5,000 on stamp duty. the process was straightforward once we had all the documents ready', true, 14, 0, '2026-01-09 15:00:00+01'),
('c0150001-0001-4000-8000-000000000002', 'malta-first-time-buyer-scheme-2026', NULL, 'Andrew Debono', 'Important to note that this only applies to your FIRST property ever. If you owned something before (even abroad I think?) you might not qualify. Double check with your notary.', true, 6, 0, '2026-01-13 11:45:00+01'),
('c0150001-0001-4000-8000-000000000003', 'malta-first-time-buyer-scheme-2026', NULL, 'saving_for_house', 'still saving up for the deposit but this gives me hope 😊 the reduced stamp duty really helps. does anyone know if there''s also a grant for first time buyers or just the stamp duty reduction?', true, 5, 0, '2026-01-17 18:30:00+01'),
('c0150001-0001-4000-8000-000000000004', 'malta-first-time-buyer-scheme-2026', 'c0150001-0001-4000-8000-000000000003', 'young_couple_mt', 'there used to be a €10k grant but im not sure if its still available in 2026. check the housing authority website or ask your bank when you apply for a mortgage!', true, 4, 0, '2026-01-18 09:15:00+01');

-- ===========================================
-- 16. malta-stamp-duty-complete-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0160001-0001-4000-8000-000000000001', 'malta-stamp-duty-complete-guide-2026', NULL, 'NotaryClerk_MT', 'Very accurate guide. I work in a notary office and we often refer clients to resources like this. The 5% rate on immovable property is the one most people need to know about.', true, 8, 0, '2026-01-11 09:00:00+01'),
('c0160001-0001-4000-8000-000000000002', 'malta-stamp-duty-complete-guide-2026', NULL, 'buyer2026', 'didnt realize stamp duty also applies to shares and insurance policies. thought it was just property. good to know!', true, 4, 0, '2026-01-15 14:30:00+01');

-- ===========================================
-- 17. malta-pension-system-2026-guide
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0170001-0001-4000-8000-000000000001', 'malta-pension-system-2026-guide', NULL, 'Carmen Buttigieg', 'Approaching retirement and this is the most complete pension guide I''ve found. The two-thirds calculation for the state pension is well explained here. Thank you', true, 7, 0, '2026-01-13 10:30:00+01'),
('c0170001-0001-4000-8000-000000000002', 'malta-pension-system-2026-guide', NULL, 'planning_ahead', 'im only 35 but already worried about pension lol. is the voluntary third pillar pension worth it? any recommendations?', true, 5, 0, '2026-01-17 16:00:00+01'),
('c0170001-0001-4000-8000-000000000003', 'malta-pension-system-2026-guide', NULL, 'RetiredTeacher', 'Can confirm the pension amounts mentioned here are accurate. Getting the maximum pension requires 40+ years of contributions which many people don''t realise until its too late. Start planning early!', true, 10, 0, '2026-01-21 08:15:00+01');

-- ===========================================
-- 18. malta-notice-period-employment-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0180001-0001-4000-8000-000000000001', 'malta-notice-period-employment-guide-2026', NULL, 'job_changer', 'just resigned and my employer is saying 4 weeks notice but ive only been there 8 months. according to this guide it should be 2 weeks right? anyone confirm?', true, 6, 0, '2026-01-10 17:30:00+01'),
('c0180001-0001-4000-8000-000000000002', 'malta-notice-period-employment-guide-2026', 'c0180001-0001-4000-8000-000000000001', 'HR_Malta', 'Check your contract first. The law sets minimum notice periods but your contract might specify longer. If contract says 4 weeks and you signed it thats what applies. If no contract then yes 2 weeks for under 1 year.', true, 9, 0, '2026-01-11 08:45:00+01'),
('c0180001-0001-4000-8000-000000000003', 'malta-notice-period-employment-guide-2026', NULL, 'GozoWorker', 'helpful article. wish i had this when i was fired without proper notice last year. ended up getting compensation through the tribunal', true, 4, 0, '2026-01-15 12:20:00+01');

-- ===========================================
-- 19. malta-retirement-age-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0190001-0001-4000-8000-000000000001', 'malta-retirement-age-guide-2026', NULL, 'Joseph Cassar', 'Retirement age going up to 65 is tough for people in physical jobs. Not everyone can work in an office till 65. The government should consider different ages for different professions.', true, 12, 1, '2026-01-12 09:00:00+01'),
('c0190001-0001-4000-8000-000000000002', 'malta-retirement-age-guide-2026', NULL, 'Sylvia_50plus', 'The calculator on this site helped me figure out exactly when I can retire and how much I''ll get. Very useful! Born in 1971 so looks like 65 for me 😅', true, 6, 0, '2026-01-16 15:30:00+01');

-- ===========================================
-- 20. malta-vacation-leave-entitlement-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0200001-0001-4000-8000-000000000001', 'malta-vacation-leave-entitlement-2026', NULL, 'office_worker_mt', 'Finally a clear explanation of leave entitlement! 192 hours (24 days) annual leave plus public holidays is actually pretty generous when you think about it', true, 7, 0, '2026-01-10 11:00:00+01'),
('c0200001-0001-4000-8000-000000000002', 'malta-vacation-leave-entitlement-2026', NULL, 'Doris Vella', 'My employer keeps telling me to use leave on public holidays when we''re closed. Is that legal? According to this article it shouldn''t be...', true, 5, 0, '2026-01-14 16:45:00+01'),
('c0200001-0001-4000-8000-000000000003', 'malta-vacation-leave-entitlement-2026', 'c0200001-0001-4000-8000-000000000002', 'EmploymentLawyer', 'Doris - no that''s not legal. Public holidays are separate from annual leave. Your employer cannot force you to use your vacation days for public holidays. You should raise this with DIER.', true, 11, 0, '2026-01-15 09:30:00+01');

-- ===========================================
-- 21. malta-overtime-pay-rates-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0210001-0001-4000-8000-000000000001', 'malta-overtime-pay-rates-2026', NULL, 'night_shift_nurse', 'the 2x rate for sundays and public holidays is important to know. ive been working sundays at 1.5x when it should be double. gonna have a chat with HR on monday 😤', true, 9, 0, '2026-01-11 22:30:00+01'),
('c0210001-0001-4000-8000-000000000002', 'malta-overtime-pay-rates-2026', NULL, 'Kevin Zarb', 'Clear and concise guide. The calculator link is super useful for checking if your overtime pay is correct. Found out I was being underpaid by about €30/month!', true, 7, 0, '2026-01-15 10:00:00+01'),
('c0210001-0001-4000-8000-000000000003', 'malta-overtime-pay-rates-2026', NULL, 'restaurant_manager', 'From an employer perspective - the overtime rates in hospitality can get expensive fast. Important for both sides to understand the rules. Good neutral article.', true, 4, 0, '2026-01-19 14:15:00+01');

-- ===========================================
-- 22. malta-mortgage-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0220001-0001-4000-8000-000000000001', 'malta-mortgage-guide-2026', NULL, 'first_home_dreams', 'the mortgage calculator on this site is amazing! helped us figure out what we can actually afford. looking at about €180k which limits options in malta but at least we know now', true, 8, 0, '2026-01-10 14:00:00+01'),
('c0220001-0001-4000-8000-000000000002', 'malta-mortgage-guide-2026', NULL, 'Martin Grima', 'Good overview. I''d recommend shopping around between banks - rates can vary by 0.5% or more which adds up to thousands over the life of the mortgage. Don''t just go with your current bank!', true, 10, 0, '2026-01-14 09:30:00+01'),
('c0220001-0001-4000-8000-000000000003', 'malta-mortgage-guide-2026', NULL, 'BankEmployee_MT', 'Solid guide. One tip: most banks require at least 10% deposit for Maltese residents and up to 30% for non-residents. Start saving early and keep good financial records for the application.', true, 6, 0, '2026-01-18 11:45:00+01');

-- ===========================================
-- 23. malta-savings-interest-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0230001-0001-4000-8000-000000000001', 'malta-savings-interest-guide-2026', NULL, 'saverMT', 'the 15% withholding tax on interest is something most people dont think about. the compound interest calculator really helps show the actual returns after tax 📊', true, 5, 0, '2026-01-12 10:30:00+01'),
('c0230001-0001-4000-8000-000000000002', 'malta-savings-interest-guide-2026', NULL, 'Rebecca Pace', 'Interest rates in Malta are finally going up a bit which is nice for savers. This guide helped me compare different options. Ended up opening a fixed deposit at BOV.', true, 4, 0, '2026-01-16 15:00:00+01');

-- ===========================================
-- 24. malta-personal-loan-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0240001-0001-4000-8000-000000000001', 'malta-personal-loan-guide-2026', NULL, 'car_buyer_mt', 'needed a personal loan for a car and this guide helped me understand the rates. ended up going with HSBC at 5.2%. the repayment calculator was super helpful!', true, 6, 0, '2026-01-13 09:15:00+01'),
('c0240001-0001-4000-8000-000000000002', 'malta-personal-loan-guide-2026', NULL, 'FinanceTips', 'Always compare the APR not just the interest rate. Some banks advertise low rates but add fees that make the actual cost higher. Good article for covering the basics', true, 7, 0, '2026-01-17 12:00:00+01'),
('c0240001-0001-4000-8000-000000000003', 'malta-personal-loan-guide-2026', NULL, 'Gabriella Z.', 'is it better to get a personal loan or use a credit card for smaller amounts (like €3000)? anyone have experience with both?', true, 3, 0, '2026-01-21 17:30:00+01');

-- ===========================================
-- 25. malta-expat-mortgage-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0250001-0001-4000-8000-000000000001', 'malta-expat-mortgage-guide-2026', NULL, 'BritInMalta', 'Getting a mortgage as an expat in Malta was way harder than expected. The AIP requirement caught me off guard. This guide would have saved me months of confusion 😩', true, 8, 0, '2026-01-11 13:00:00+01'),
('c0250001-0001-4000-8000-000000000002', 'malta-expat-mortgage-guide-2026', NULL, 'Dutch_Malta_Life', 'useful guide! we managed to get approved with APS bank. they seemed the most expat-friendly. 70% LTV was the max they offered us as non-maltese', true, 5, 0, '2026-01-16 10:30:00+01'),
('c0250001-0001-4000-8000-000000000003', 'malta-expat-mortgage-guide-2026', NULL, 'relocating_2026', 'Thank you for this! Moving to Malta in March and buying property is high on my list. The stamp duty section was especially helpful. Bookmarked! 📌', true, 4, 0, '2026-01-20 16:00:00+01');

-- ===========================================
-- 26. malta-vehicle-registration-tax-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0260001-0001-4000-8000-000000000001', 'malta-vehicle-registration-tax-guide-2026', NULL, 'CarGuyMalta', 'the CO2 based tax system really punishes bigger engines. my BMW 330d costs almost 3x more in registration tax than my wife''s Fiat 500. might need to reconsider the next car purchase lol', true, 7, 0, '2026-01-14 11:00:00+01'),
('c0260001-0001-4000-8000-000000000002', 'malta-vehicle-registration-tax-guide-2026', NULL, 'EV_owner_mt', 'This is why I went electric. Zero registration tax, no road license, and cheaper to run. The VRT calculator on this site confirmed the savings for me 🔋', true, 9, 0, '2026-01-18 14:30:00+01'),
('c0260001-0001-4000-8000-000000000003', 'malta-vehicle-registration-tax-guide-2026', NULL, 'Simon Borg', 'comprehensive guide. Malta''s reg tax is honestly one of the highest in Europe. Something to consider when buying a new car here vs other countries.', true, 5, 0, '2026-01-22 09:15:00+01');

-- ===========================================
-- 27. malta-road-license-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0270001-0001-4000-8000-000000000001', 'malta-road-license-guide-2026', NULL, 'driver_mt_2020', 'almost forgot to renew mine and this reminded me! the online renewal through transport.gov.mt is actually pretty smooth now', true, 4, 0, '2026-01-15 10:00:00+01'),
('c0270001-0001-4000-8000-000000000002', 'malta-road-license-guide-2026', NULL, 'Sharon Debattista', 'Is it true electric cars dont pay road license? Seriously considering getting one if thats the case! The annual savings would be significant.', true, 5, 0, '2026-01-19 13:45:00+01');

-- ===========================================
-- 28. malta-drivers-license-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0280001-0001-4000-8000-000000000001', 'malta-drivers-license-guide-2026', NULL, 'learning_driver', 'passed my test last month! this guide was really helpful for understanding all the fees involved. the theory test wasnt too bad but the practical in maltese traffic... that was an adventure 😅', true, 8, 0, '2026-01-12 16:00:00+01'),
('c0280001-0001-4000-8000-000000000002', 'malta-drivers-license-guide-2026', NULL, 'ExpatsInGozo', 'For EU citizens - you can use your home country license for the first year, then you need to exchange it. The process is described well here. Took me about 3 weeks at Transport Malta.', true, 6, 0, '2026-01-16 11:30:00+01'),
('c0280001-0001-4000-8000-000000000003', 'malta-drivers-license-guide-2026', NULL, 'proud_new_driver', 'just got my license! total cost was around €700 including lessons, tests and all fees. this guide helped me budget for everything from the start', true, 5, 0, '2026-01-20 18:00:00+01');

-- ===========================================
-- 29. malta-vrt-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0290001-0001-4000-8000-000000000001', 'malta-vrt-guide-2026', NULL, 'old_car_owner', 'my car failed VRT last year because of a brake issue. cost me €200 to fix plus the retest fee. make sure you get things checked before going for the test!', true, 6, 0, '2026-01-13 09:30:00+01'),
('c0290001-0001-4000-8000-000000000002', 'malta-vrt-guide-2026', NULL, 'Mariella F.', 'Helpful guide. Quick tip for everyone - book your VRT appointment early because the wait times can be weeks especially around renewal season. Dont leave it till the last minute', true, 7, 0, '2026-01-17 14:00:00+01');

-- ===========================================
-- 30. malta-import-vehicle-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0300001-0001-4000-8000-000000000001', 'malta-import-vehicle-guide-2026', NULL, 'imported_my_merc', 'brought my car from Germany. the registration tax was brutal but at least the process is explained well here. shipping + tax + registration ended up around €8k total 😬', true, 7, 0, '2026-01-11 12:00:00+01'),
('c0300001-0001-4000-8000-000000000002', 'malta-import-vehicle-guide-2026', NULL, 'UK_to_Malta', 'For anyone importing from the UK post-Brexit - there are additional customs duties now. Make sure to factor that in. This guide covers the basics well but worth checking the latest customs regs too.', true, 5, 0, '2026-01-15 10:15:00+01'),
('c0300001-0001-4000-8000-000000000003', 'malta-import-vehicle-guide-2026', NULL, 'CarDealerMT', 'As someone in the trade, this is a good consumer guide. The calculator tool for registration tax is quite accurate too. Recommend using it before making any decisions on importing.', true, 8, 0, '2026-01-19 15:30:00+01');

-- ===========================================
-- 31. malta-social-security-number-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0310001-0001-4000-8000-000000000001', 'malta-social-security-number-guide-2026', NULL, 'new_arrival_mt', 'just applied for my SSN last week. the process was actually easier than expected. went to birzebbugia office and was done in 20 minutes. thanks for the guide it helped me prepare the documents!', true, 6, 0, '2026-01-14 14:00:00+01'),
('c0310001-0001-4000-8000-000000000002', 'malta-social-security-number-guide-2026', NULL, 'MaltaRelocation', 'This is one of the first things you need to do when moving to Malta. SSN is required for everything - bank accounts, employment, healthcare. Get it sorted ASAP', true, 8, 0, '2026-01-18 09:30:00+01'),
('c0310001-0001-4000-8000-000000000003', 'malta-social-security-number-guide-2026', NULL, 'confused_about_docs', 'do i need the SSN before starting work or can my employer help me get it? moving next month and a bit stressed about all the paperwork 😰', true, 3, 0, '2026-01-22 16:45:00+01'),
('c0310001-0001-4000-8000-000000000004', 'malta-social-security-number-guide-2026', 'c0310001-0001-4000-8000-000000000003', 'new_arrival_mt', 'most employers will start you while the SSN is being processed. just get the application in asap. you need your passport/ID and proof of address. dont stress too much!', true, 5, 0, '2026-01-23 08:00:00+01');

-- ===========================================
-- 32. malta-work-permit-employment-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0320001-0001-4000-8000-000000000001', 'malta-work-permit-employment-guide-2026', NULL, 'TCN_worker', 'The single permit process took about 3 months for me. This guide is accurate but be prepared for delays. Jobsplus can be slow sometimes. Keep following up!', true, 7, 0, '2026-01-10 11:00:00+01'),
('c0320001-0001-4000-8000-000000000002', 'malta-work-permit-employment-guide-2026', NULL, 'HR_Recruiter_MT', 'We sponsor work permits regularly and this is a solid overview. The key message for non-EU workers: your employer needs to be involved from the start. You cant apply independently.', true, 9, 0, '2026-01-14 14:30:00+01'),
('c0320001-0001-4000-8000-000000000003', 'malta-work-permit-employment-guide-2026', NULL, 'IndianInMalta', 'great guide!! moved here from bangalore for an IT job. the work permit process was handled by my company but its good to understand the system. also the salary requirements section is very useful 🙏', true, 6, 0, '2026-01-18 18:00:00+01');

-- ===========================================
-- 33. malta-mysocialsecurity-app-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0330001-0001-4000-8000-000000000001', 'malta-mysocialsecurity-app-guide-2026', NULL, 'tech_savvy_boomer', 'finally downloaded the app after reading this. actually works pretty well! can see all my contribution history and pension projection. way better than calling the social security office 📱', true, 8, 0, '2026-01-12 10:00:00+01'),
('c0330001-0001-4000-8000-000000000002', 'malta-mysocialsecurity-app-guide-2026', NULL, 'MaryJane_gozo', 'The app keeps crashing on my phone when I try to login. Anyone else having this issue? Using android 14', true, 2, 0, '2026-01-15 15:30:00+01'),
('c0330001-0001-4000-8000-000000000003', 'malta-mysocialsecurity-app-guide-2026', 'c0330001-0001-4000-8000-000000000002', 'tech_savvy_boomer', 'try clearing the app cache and updating it from the play store. that fixed it for me. if not, try the web version at mysocialsecurity.gov.mt', true, 4, 0, '2026-01-16 08:45:00+01');

-- ===========================================
-- 34. malta-family-reunification-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0340001-0001-4000-8000-000000000001', 'malta-family-reunification-guide-2026', NULL, 'missing_my_family', 'this process is honestly so stressful. been waiting 4 months for my wife''s visa. the salary threshold information here is accurate though - make sure you meet it before applying!', true, 9, 0, '2026-01-11 20:00:00+01'),
('c0340001-0001-4000-8000-000000000002', 'malta-family-reunification-guide-2026', NULL, 'Priya K.', 'Thank you for such a detailed guide! My husband works in Malta and we''re applying for family reunification. The document checklist at the end saved us a lot of time and confusion 💕', true, 7, 0, '2026-01-15 12:30:00+01'),
('c0340001-0001-4000-8000-000000000003', 'malta-family-reunification-guide-2026', NULL, 'ImmigrationAdvice', 'Good guide but I want to add - make sure your accommodation meets the requirements too. Identity Malta checks that your apartment/house is adequate for the number of family members.', true, 5, 0, '2026-01-19 09:00:00+01'),
('c0340001-0001-4000-8000-000000000004', 'malta-family-reunification-guide-2026', 'c0340001-0001-4000-8000-000000000001', 'same_boat_here', 'hang in there! ours took 5 months but finally got approved. the waiting is the hardest part. make sure all your documents are perfect the first time to avoid delays', true, 6, 0, '2026-01-13 14:15:00+01');

-- ===========================================
-- 35. malta-childrens-allowance-guide-2026
-- ===========================================
INSERT INTO blog_comments (id, blog_slug, parent_id, author_name, content, is_approved, likes, dislikes, created_at) VALUES
('c0350001-0001-4000-8000-000000000001', 'malta-childrens-allowance-guide-2026', NULL, 'Mama_of_3', 'The allowance amounts have increased nicely this year! With 3 kids every extra euro helps. The calculator tool told us exactly what we''d get - was spot on with what we received 🎉', true, 10, 0, '2026-01-09 11:30:00+01'),
('c0350001-0001-4000-8000-000000000002', 'malta-childrens-allowance-guide-2026', NULL, 'new_dad_malta', 'just had our first baby and didnt know about this allowance at all! applied straight away after reading this. thanks for the step by step guide', true, 7, 0, '2026-01-13 16:00:00+01'),
('c0350001-0001-4000-8000-000000000003', 'malta-childrens-allowance-guide-2026', NULL, 'Karen Sacco', 'Worth mentioning that the income threshold matters! If household income is too high you get a reduced amount or nothing. The guide covers this well but just highlighting it for people who might miss it.', true, 6, 0, '2026-01-17 10:15:00+01');

-- ===========================================
-- VOTE RECORDS (matching like/dislike counts)
-- Oncelikle likes/dislikes gercekci degerlere guncellenir,
-- sonra eslesen vote kayitlari olusturulur.
-- Kucuk bir niche blog icin: cogu yorum 0-2, iyi olanlar 3-5, nadir 6-7 like.
-- ===========================================
DO $$
DECLARE
  rec RECORD;
  i INT;
  voter_counter INT := 1;
  new_likes INT;
  new_dislikes INT;
  h INT;
BEGIN
  -- 1. Mevcut likes/dislikes'i gercekci degerlere guncelle
  FOR rec IN SELECT id FROM blog_comments ORDER BY id LOOP
    h := abs(hashtext(rec.id::text));

    -- Dagilim: %30 -> 0, %25 -> 1, %20 -> 2, %12 -> 3, %8 -> 4, %5 -> 5-7
    CASE
      WHEN (h % 100) < 30 THEN new_likes := 0;
      WHEN (h % 100) < 55 THEN new_likes := 1;
      WHEN (h % 100) < 75 THEN new_likes := 2;
      WHEN (h % 100) < 87 THEN new_likes := 3;
      WHEN (h % 100) < 95 THEN new_likes := 4;
      ELSE new_likes := 5 + (h % 3); -- 5, 6 veya 7
    END CASE;

    -- Dislike cok nadir: ~%5 ihtimalle 1
    IF (h % 20) = 0 THEN
      new_dislikes := 1;
    ELSE
      new_dislikes := 0;
    END IF;

    UPDATE blog_comments SET likes = new_likes, dislikes = new_dislikes WHERE id = rec.id;
  END LOOP;

  -- 2. Mevcut seed vote kayitlarini temizle (idempotent olsun)
  DELETE FROM blog_comment_votes WHERE voter_id LIKE 'seed-voter-%';

  -- 3. Guncellenmis likes/dislikes'a gore vote kayitlari olustur
  FOR rec IN SELECT id, likes, dislikes FROM blog_comments ORDER BY id LOOP
    FOR i IN 1..rec.likes LOOP
      INSERT INTO blog_comment_votes (comment_id, voter_id, vote_type)
      VALUES (rec.id, 'seed-voter-' || LPAD(voter_counter::text, 4, '0'), 'like');
      voter_counter := voter_counter + 1;
    END LOOP;

    FOR i IN 1..GREATEST(rec.dislikes, 0) LOOP
      INSERT INTO blog_comment_votes (comment_id, voter_id, vote_type)
      VALUES (rec.id, 'seed-voter-' || LPAD(voter_counter::text, 4, '0'), 'dislike');
      voter_counter := voter_counter + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Updated comments and generated % vote records', voter_counter - 1;
END $$;
