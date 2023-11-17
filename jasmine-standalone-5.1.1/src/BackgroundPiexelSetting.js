
describe('Background Pixels Setting', () => {
  let bgPixels;

  beforeAll(() => {
    // Set up a canvas and initialize the background pixels
    createCanvas(640, 480);
    myVid = createCapture(VIDEO);
    myVid.size(width, height);
    myVid.hide();
    bgPixels = [];

    // Call the setBG function
    setBG();
  });

  it('should set the background pixels with the same dimensions as the canvas', () => {
    expect(bgPixs.length).toBe(640 * 480 * 4); // RGBA format, 4 bytes per pixel
  });

  it('should set the background pixels with non-zero values', () => {
    // Check if at least one pixel is non-zero
    let nonZeroPixelFound = false;
    for (let i = 0; i < bgPixs.length; i += 4) {
      if (bgPixs[i] !== 0 || bgPixs[i + 1] !== 0 || bgPixs[i + 2] !== 0 || bgPixs[i + 3] !== 0) {
        nonZeroPixelFound = true;
        break;
      }
    }
    expect(nonZeroPixelFound).toBe(true);
  });

  // Cleanup after the tests...
  afterAll(() => {
    // Close the canvas or perform any necessary cleanup
    // (Note: In a real test environment, you may need to clean up resources differently)
    myVid.remove();
    thresholdSlider.remove();
  });
});

describe('Pixel Differencing Logic', () => {
  beforeEach(() => {
    // Set up canvas and initialize variables before each test
    createCanvas(640, 480);
    myVid = createCapture(VIDEO);
    myVid.size(width, height);
    myVid.hide();
    bgPixs = [];
    thresholdSlider = createSlider(0, 255, 100);
  });

  it('should correctly process pixels based on the threshold', () => {
    // Set a background value for bgPixs (simulating the setBG function)
    myVid.loadPixels();
    bgPixs = myVid.pixels;

    // Define test pixels with varying differences from background
    const testPixels = new Uint8Array(bgPixs.length);
    for (let i = 0; i < testPixels.length; i += 4) {
      testPixels[i] = 127; // Red component
      testPixels[i + 1] = 127; // Green component
      testPixels[i + 2] = 127; // Blue component
      testPixels[i + 3] = 255; // Alpha component
    }

    // Set test pixels as the current frame's pixels
    myVid.pixels = testPixels;

    // Run the draw function (assuming it's called here)
    draw();

    // Check if the output pixels match the expected result based on threshold
    myVid.loadPixels();
    for (let i = 0; i < myVid.pixels.length; i += 4) {
      const avgDiff = (Math.abs(myVid.pixels[i] - bgPixs[i]) + Math.abs(myVid.pixels[i + 1] - bgPixs[i + 1]) + Math.abs(myVid.pixels[i + 2] - bgPixs[i + 2])) / 3;
      if (avgDiff > thresholdSlider.value()) {
        // If the difference is above threshold, the pixel should be black (0,0,0)
        expect(myVid.pixels[i]).toBe(0);
        expect(myVid.pixels[i + 1]).toBe(0);
        expect(myVid.pixels[i + 2]).toBe(0);
      } else {
        // If the difference is below threshold, the pixel should be the same as testPixels
        expect(myVid.pixels[i]).toBe(testPixels[i]);
        expect(myVid.pixels[i + 1]).toBe(testPixels[i + 1]);
        expect(myVid.pixels[i + 2]).toBe(testPixels[i + 2]);
      }
    }
  });

  // Cleanup after each test...
  afterEach(() => {
    myVid.remove();
    thresholdSlider.remove();
  });
});