export class WindGL {
  constructor(gl) {
    this.gl = gl;
    this.numParticles = 65536;
    this.fadeOpacity = 0.996;
    this.speedFactor = 0.25;
    this.dropRate = 0.003;
    this.dropRateBump = 0.01;
    this.windData = null;
  }

  resize() {
    const gl = this.gl;
    const width = gl.canvas.width;
    const height = gl.canvas.height;
    gl.viewport(0, 0, width, height);
  }

  setWind(windData) {
    this.windData = windData;
  }

  draw() {
    // Implement WebGL drawing logic here
    // This is a placeholder for the actual WebGL implementation
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}

export const initWindGL = (gl) => {
  const wind = new WindGL(gl);
  wind.numParticles = 65536;
  return wind;
};

export const updateWindData = async (wind, timestamp) => {
  try {
    const response = await fetch(`/api/wind-data?timestamp=${timestamp}`);
    if (!response.ok) throw new Error('Failed to fetch wind data');
    const windData = await response.json();
    
    // Load wind image
    const image = new Image();
    image.src = windData.imageUrl;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
    
    windData.image = image;
    wind.setWind(windData);
    return true;
  } catch (error) {
    console.error('Error updating wind data:', error);
    return false;
  }
};