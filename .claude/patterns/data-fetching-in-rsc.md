# Data fetching in React Server Components

_Group: data-fetching_

In Next.js projects we read data directly in server components via async/await. We do not use useEffect for fetching. Mutations go through Server Actions, and the cache is refreshed via revalidateTag/revalidatePath.
