# Collage Source and Crop Coordinates

`source.webp` is an unchanged copy of the user's `download.webp`, supplied on
17 September 2026. It is 2880 × 2880 pixels. The illustrated band contains 36
compositions, including two adjacent works with no white gutter at the lower left.

`crop-bounds.json` records `[left, top, right, bottom]` in the 1600-pixel inspection
coordinate system. Multiply each coordinate by `2880 / 1600` and round independently
to obtain native integer pixel edges. Width is right minus left; height is bottom
minus top. Extract that rectangle and encode losslessly as PNG, without resizing.

The resulting `plate-01.png` through `plate-36.png` are in
`public/artwork/grigoriev-collage/`. Their identification table and source references
are in that directory's README. The app catalogue is `src/lib/collage-catalogue.ts`.
Existing higher-resolution scene files are retained; collage thumbnails do not
replace them or the user's approved portrait studies.

Extraction used Sharp already installed with the project. This is pixel extraction,
not an AI edit, and enlargement must never be described as detail restoration.
