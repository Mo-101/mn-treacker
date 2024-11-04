import { API_CONFIG } from '../config/apiConfig';

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

export const updateWindData = async (wind, hour = 0) => {
  try {
    const timestamp = Object.keys(API_CONFIG.ENDPOINTS.WIND_DATA)[Math.floor(hour / 6) % 9];
    const { data, image } = await fetchWindData(timestamp);
    
    if (!data || !image) throw new Error('Failed to fetch wind data');
    
    wind.setWind({ ...data, image });
    return true;
  } catch (error) {
    console.error('Error updating wind data:', error);
    return false;
  }
};
