import {GlContext} from "../gl";

export default class Texture {
    private glTexture: WebGLTexture;
    private image: HTMLImageElement;

    constructor(glContext: GlContext, path: string) {
        const gl = glContext.gl;
        this.glTexture = gl.createTexture()!;
        this.image = new Image();
        this.image.src = path;
        this.image.onload = () => {
            // Based on https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            if (isPowerOf2(this.image.width) && isPowerOf2(this.image.height)) {
                // w & h are power of 2 -> Generate mipmaps
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // w & h are NOT power of 2 -> wrap edges
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            }
        };
    }
}

function isPowerOf2(value: number) {
    // tslint:disable-next-line:no-bitwise
    return (value & (value - 1)) === 0;
}
