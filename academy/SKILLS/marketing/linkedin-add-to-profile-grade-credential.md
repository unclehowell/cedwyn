# LinkedIn "Add to profile" credential for each Academy grade passed
Harvested 30 Oct 2026. 'open badge', 'add to profile' and 'credly' had 0 skill hits before; the existing certificate files cover art editions and screenings. Members who pass a grade post it themselves, which is free word of mouth with a link back to the site.

## Facts (read 30 Oct 2026)
- **LinkedIn Help a528030:** the Add to Profile button lets users add certifications. Providers *with a LinkedIn Page* can build the button on LinkedIn's Add to Profile page. When the user's link carries no parameters, nothing is pre-filled and the user types the details.
- **Pre-filled URL format** (CertFusion builder, read): `linkedin.com
  - `startTask=CERTIFICATION_NAME` and `name` are required, plus **one of** `organizationName` (plain text, any issuer) or `organizationId` (numeric ID of the LinkedIn Page, which links the logo).
  - `issueYear`/`issueMonth` are recommended. Omit `expiration*` for a credential that doesn't expire.
  - `certUrl` renders a **"Show credential"** button that points to our verification page. `certId` is shown for lookups.
- The builder's marketing points (each pass shows in the learner's network feed; the "Show credential" link brings visitors who already care) are the vendor's own arguments. It gives no figures, so treat them as not checked.

## How to do it
1. Give each pass a **verification page**: `/learn/credential/<certId>/`. It shows the grade name, issue month and "verified by Cedwyn Academy". Use a first name or initials only if the member opts in, and `noindex` it if it carries a name.
2. On the pass screen, offer **"Add Grade N to LinkedIn"** with the pre-filled URL (URL-encode every value), plus a "Copy share text" option for other networks.
3. Name the credential plainly: "Cedwyn Academy — Grade 3: Reading primary sources". Issuer: "Cedwyn Academy" via `organizationName`, or `organizationId` once there is a company Page. We have a LinkedIn login for Cedwyn posting; check whether it is a Page before using an ID.
4. Measure clicks on the button (an event in our own analytics) and visits to /learn/credential/ pages arriving from linkedin.com.

## Tool (own stdlib script, no install)
`the project workspace NAME ORG YEAR MONTH CERT_URL CERT_ID` prints the URL-encoded Add-to-profile link. Tested 30 Oct 2026 with a dummy Grade 1 credential.

## How we apply it to Cedwyn
- A PROPOSAL for the grades build (a worker): at a pass of 90% or more, write a credential row (cert_id, member, grade, issued) to D1, render the verification page, and show the button. The privacy default is no surname on the page.
- Each "Show credential" click lands on a Cedwyn page that links back to /learn/. Grade 1, as a free preview, can issue a credential too. That is the cheapest acquisition loop we have.
- Copy stays neutral and never names the project lead. The credential reflects the member's study and is not an accreditation; say "not accredited" on the verification page.

## Sources
- linkedin.com (read)
- certfusion.com (read; vendor page, parameter list)