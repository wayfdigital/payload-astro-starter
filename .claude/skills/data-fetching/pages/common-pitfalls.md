# Common Pitfalls

## 1) Prop Drilling Data Through Server Component Trees

### Problem

Fetching data at the page level and passing it through many intermediate components.

### Better approach

Fetch where data is actually consumed and rely on React `cache()` to deduplicate.

## 2) Using TanStack Query for Static/SEO-Critical Content

### Problem

Client-only fetching for content that should be present in initial HTML.

### Better approach

Render that content in Server Components so crawlers and users receive complete first paint.

## 3) Missing `cache()` Around Reused Server Queries

### Problem

Same payload query executed repeatedly in one request lifecycle.

### Better approach

Wrap shared server fetchers in React `cache()` and call those functions consistently.

## 4) Time-Based Revalidation Without Event-Based Invalidation

### Problem

CMS content changes but users wait until `revalidate` interval expires.

### Better approach

Use on-demand revalidation (`revalidatePath`/`revalidateTag`) triggered by Payload webhook/hooks.

## 5) Overfetching Collection Data

### Problem

Using broad `find` queries and selecting whole documents for small UI fragments.

### Better approach

Use `select`, `where`, and pagination defaults to control payload size and compute costs.
