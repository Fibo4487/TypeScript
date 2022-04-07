import GallowsImage from "./assets/gallows.png";
import BodyImage from "./assets/body.png";
import LeftArmImage from "./assets/left-arm.png";
import RightArmImage from "./assets/right-arm.png";
import LeftLegImage from "./assets/left-leg.png";
import RightLegImage from "./assets/right-leg.png";
import HeadImage from "./assets/head.png";

export function calculateImageSize(
  width: number,
  height: number,
  percent: number
): number[] {
  const calculatedPercent = percent / 100;
  const calculatedWidth = width * calculatedPercent;
  const calculatedHeight = height * calculatedPercent;

  return [calculatedWidth, calculatedHeight];
}

export type ImageData = {
  name: string;
  url: string;
  dx: number;
  dy: number;
}[];

const imageData: ImageData = [
  { name: "right-leg", url: RightLegImage, dx: 242, dy: 290 },
  { name: "left-leg", url: LeftLegImage, dx: 193, dy: 290 },

  { name: "right-arm", url: RightArmImage, dx: 240, dy: 200 },
  { name: "left-arm", url: LeftArmImage, dx: 135, dy: 200 },

  { name: "body", url: BodyImage, dx: 185, dy: 180 },
  { name: "head", url: HeadImage, dx: 190, dy: 60 },
  { name: "gallows", url: GallowsImage, dx: 10, dy: 20 },
];

export type fetchedImageData = {
  image: HTMLImageElement;
  name: string;
  dx: number;
  dy: number;
};

export function loadImage(
  url: string,
  name: string,
  dx: number,
  dy: number
): Promise<fetchedImageData> {
  return new Promise((resolve, reject) => {
    const image = <HTMLImageElement>new Image();
    image.src = url;

    image.addEventListener("load", () => resolve({ image, name, dx, dy }));
    image.addEventListener("error", () =>
      reject(new Error(`Error on loading ${url}`))
    );
  });
}

export function fetchAllImages() {
  return Promise.all<fetchedImageData>(
    imageData.map((item) => loadImage(item.url, item.name, item.dx, item.dy))
  );
}
