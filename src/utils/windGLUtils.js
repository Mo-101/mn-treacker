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
    if (!this.windData) return;
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}

export const initWindGL = (gl) => {
  const wind = new WindGL(gl);
  wind.numParticles = 65536;
  return wind;
};

const windFiles = {
  0: '2016112000',
  6: '2016112006',
  12: '2016112012',
  18: '2016112018',
  24: '2016112100',
  30: '2016112106',
  36: '2016112112',
  42: '2016112118',
  48: '2016112200'
};

export const updateWindData = async (wind, hour = 0) => {
  try {
    const timestamp = windFiles[hour] || windFiles[0];
    const jsonPath = `/wind/${timestamp}.json`;
    const imagePath = `/wind/${timestamp}.png`;
    
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error('Failed to fetch wind data');
    const windData = await response.json();
    
    // Load wind image
    const image = new Image();
    image.src = imagePath;
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