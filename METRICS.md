# Metrics

The North Star metric is qualified savings discovered per week, measured as the total monthly savings from completed audits where the user also captures the report or books a consultation. This matches the product better than DAU because teams do not need to audit AI spend every day. The tool wins when it uncovers credible savings and creates a reason for Credex to talk to the right buyer.

The first input metric is audit completion rate: visitors who start entering tools and reach a results page. If this is weak, the form is too long or the value proposition is unclear. The second input metric is captured lead rate after results. Since email comes after value, this shows whether the audit is useful enough to save. The third input metric is high-savings consultation rate: users with more than $500/month savings who choose the Credex path.

I would instrument page view, form start, tool added, audit completed, share link copied, lead captured, and consultation CTA clicked. I would also log savings band, team size band, and primary use case without storing sensitive company details in analytics.

A pivot trigger would be 500 completed audits with less than 5% email capture and fewer than 2% high-savings consultation clicks. That would mean the tool is interesting but not urgent, and Credex should either narrow the target segment or turn the product into a deeper benchmark report.
