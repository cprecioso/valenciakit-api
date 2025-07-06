import { assert } from "@std/assert";
import { join } from "@std/path";
import { fetchParkings } from "./fetch-parkings.ts";

const bikeParkingsData = await fetchParkings();
const bikeParkingsFile = new TextEncoder().encode(
  JSON.stringify(bikeParkingsData, null, 2),
);

const manifestData = {
  bikeParkings: {
    updatedAt: bikeParkingsData.updatedAt.toISOString(),
    size: bikeParkingsFile.length,
  },
};
const manifestFile = new TextEncoder().encode(
  JSON.stringify(manifestData, null, 2),
);

const dest = Deno.args[0];
assert(dest, "Destination directory must be provided as the first argument");

await Deno.mkdir(dest, { recursive: true });
await Deno.writeFile(join(dest, "bike-parkings.json"), bikeParkingsFile);
await Deno.writeFile(join(dest, "manifest.json"), manifestFile);
