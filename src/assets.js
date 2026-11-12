// Asset loader, pixel-art canvas slicing, and Three.js texture helpers.

import * as THREE from 'three';

export const PACK_BASE = '/assets/Ninja%20Adventure%20-%20Asset%20Pack';

const imageCache = new Map();

export function loadImage(url) {
  if (imageCache.has(url)) return imageCache.get(url);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
  imageCache.set(url, promise);
  return promise;
}

export function canvasToTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Slices a rectangular region (in pixels) out of a loaded Image into a new Canvas.
 */
export function sliceCanvas(img, sx, sy, sw, sh, outW = sw, outH = sh) {
  const c = document.createElement('canvas');
  c.width = outW;
  c.height = outH;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
  return c;
}

/**
 * Slices a tile by grid coordinates (col, row) with 16px unit size.
 */
export function sliceTileTexture(img, col, row, tilesW = 1, tilesH = 1) {
  const c = sliceCanvas(img, col * 16, row * 16, tilesW * 16, tilesH * 16);
  return canvasToTexture(c);
}

export function characterSheetUrl(charName) {
  return `${PACK_BASE}/Actor/Character/${encodeURIComponent(charName)}/SpriteSheet.png`;
}

export function characterFacesetUrl(charName) {
  return `${PACK_BASE}/Actor/Character/${encodeURIComponent(charName)}/Faceset.png`;
}

export function emoteUrl(emoteNumber) {
  return `${PACK_BASE}/Ui/Emote/emote${emoteNumber}.png`;
}

export function plantPortraitUrl(plantId) {
  return `/game/plants/${plantId}.${plantId === "benguet_pine" ? "png" : "svg"}`;
}

export function plantPhotoUrl(plantId) {
  return `/game/photos/${plantId}.jpg`;
}

export function plantWorldUrl(plantId) {
  return plantId === "benguet_pine" ? `/game/plants/${plantId}_world.png` : `/game/plants/${plantId}.svg`;
}

/**
 * Loads all core tilesets, character sheets, emotes, and plant sprites needed for the demo.
 */
export async function loadAllAssets(plantIds, characterNames) {
  const tilesetUrls = {
    floor: `${PACK_BASE}/Backgrounds/Tilesets/TilesetFloor.png`,
    nature: `${PACK_BASE}/Backgrounds/Tilesets/TilesetNature.png`,
    relief: `${PACK_BASE}/Backgrounds/Tilesets/TilesetRelief.png`,
    element: `${PACK_BASE}/Backgrounds/Tilesets/TilesetElement.png`,
    house: `${PACK_BASE}/Backgrounds/Tilesets/TilesetHouse.png`,
  };

  const [floor, nature, relief, element, house] = await Promise.all([
    loadImage(tilesetUrls.floor),
    loadImage(tilesetUrls.nature),
    loadImage(tilesetUrls.relief),
    loadImage(tilesetUrls.element),
    loadImage(tilesetUrls.house),
  ]);

  const characters = {};
  await Promise.all(
    characterNames.map(async (name) => {
      const [sheet, face] = await Promise.all([
        loadImage(characterSheetUrl(name)),
        loadImage(characterFacesetUrl(name)),
      ]);
      characters[name] = { sheet, face, faceUrl: characterFacesetUrl(name) };
    }),
  );

  const plants = {};
  await Promise.all(
    plantIds.map(async (id) => {
      const [portrait, world] = await Promise.all([
        loadImage(plantPortraitUrl(id)),
        loadImage(plantWorldUrl(id)),
      ]);
      plants[id] = {
        portrait,
        world,
        portraitUrl: plantPortraitUrl(id),
        worldUrl: plantWorldUrl(id),
        photoUrl: plantPhotoUrl(id),
        worldTex: canvasToTexture(sliceCanvas(world, 0, 0, world.width, world.height)),
      };
    }),
  );

  const animalSpecs = {
    cat_ginger: ['Cat/SpriteSheet.png', 'Cat/Faceset.png'],
    cat_orange: ['CatOrange/SpriteSheet.png', 'CatOrange/Faceset.png'],
    cat_black: ['CatBlack/SpriteSheet.png', 'CatBlack/Faceset.png'],
    cat_white: ['CatWhite/SpriteSheet.png', 'CatWhite/Faceset.png'],
    dog_brown: ['Dog/SpriteSheet.png', 'Dog/Faceset.png'],
    dog_spotted: ['Dog2/SpriteSheet.png', 'Dog2/Faceset.png'],
    dog_orange: ['DogOrange/SpriteSheet.png', 'DogOrange/Faceset.png'],
    dog_yellow: ['DogYellow/SpriteSheet.png', 'DogYellow/Faceset.png'],
    bird_blue: ['Parrot/SpriteSheetBlue.png', 'Parrot/FacesetBlue.png'],
    bird_red: ['Parrot/SpriteSheetRed.png', 'Parrot/FacesetRed.png'],
    bird_sparrow: ['Chicken/SpriteSheetCute.png', 'Chicken/FacesetCute.png'],
    bird_dove: ['Chicken/SpriteSheetWhite.png', 'Chicken/FacesetWhite.png'],
  };
  const animals = {};
  await Promise.all(
    Object.entries(animalSpecs).map(async ([key, [sheetRel, faceRel]]) => {
      const sheetUrl = `${PACK_BASE}/Actor/Animal/${sheetRel}`;
      const faceUrl = `${PACK_BASE}/Actor/Animal/${faceRel}`;
      const [sheet, face] = await Promise.all([loadImage(sheetUrl), loadImage(faceUrl)]);
      animals[key] = { sheet, face, faceUrl, isAnimal: true };
    }),
  );

  const emoteNums = [12, 20, 22, 25, 27];
  const emotes = {};
  await Promise.all(
    emoteNums.map(async (num) => {
      const img = await loadImage(emoteUrl(num));
      emotes[num] = canvasToTexture(sliceCanvas(img, 0, 0, img.width, img.height));
    }),
  );

  const [leafSheet, butterflyOrangeSheet, butterflyBlueSheet] = await Promise.all([
    loadImage(`${PACK_BASE}/FX/Particle/Leaf.png`),
    loadImage(`${PACK_BASE}/Actor/Monster/Butterfly/SpriteSheet.png`),
    loadImage(`${PACK_BASE}/Actor/Monster/ButterflyBlue/SpriteSheet.png`),
  ]);
  const leafFrames = Array.from({ length: 6 }, (_, i) =>
    canvasToTexture(sliceCanvas(leafSheet, i * 12, 0, 12, 7)),
  );
  const butterflyFrames = {
    orange: Array.from({ length: 4 }, (_, row) =>
      canvasToTexture(sliceCanvas(butterflyOrangeSheet, 0, row * 16, 16, 16)),
    ),
    blue: Array.from({ length: 4 }, (_, row) =>
      canvasToTexture(sliceCanvas(butterflyBlueSheet, 0, row * 16, 16, 16)),
    ),
  };

  return {
    tilesets: { floor, nature, relief, element, house },
    characters,
    animals,
    plants,
    emotes,
    leafFrames,
    butterflyFrames,
  };
}
