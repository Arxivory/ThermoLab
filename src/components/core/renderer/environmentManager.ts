import * as THREE from "three"
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let cachedEnvMap: THREE.Texture | null = null;

export async function getEnvironmentMap(renderer: THREE.WebGLRenderer) {
    if (cachedEnvMap) return cachedEnvMap;

    const loader = new RGBELoader();

    const hdr = await loader.loadAsync(
        "textures/environmentmaps/autumn_hill_view_4k.hdr"
    );

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    cachedEnvMap = pmrem.fromEquirectangular(hdr).texture;

    hdr.dispose();
    pmrem.dispose();

    return cachedEnvMap;
}