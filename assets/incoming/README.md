# Incoming images

Drop new photos here, then tell Kilo to publish them.

This folder is **not** published to the website and **not** deployed — it only
exists so there is an obvious place to put files before they are processed.

## What happens to a file placed here

1. It gets resized and converted to `.webp` (full size) and `-sm.webp`
   (640px thumbnail), same as the other gallery photos.
2. It is added to `galleryImages` in `src/data/index.ts`, which is what the
   Gallery section on the homepage reads.
3. It is committed and pushed.

## Naming

Use a short lowercase name describing the photo, for example:

- `farmhouse-night.jpg`
- `clubhouse-interior.jpg`
- `layout-plan.jpg`

Avoid spaces and avoid the names already used by the generated posters
(`farmhouse`, `weekend-houses`), which would overwrite them.