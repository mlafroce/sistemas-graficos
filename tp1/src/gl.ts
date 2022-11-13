export class GlContext {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl")!;
        if (!this.gl) {
            throw new Error("No webgl context available");
        }
    }

    public createVertexShader(source: string): WebGLShader {
        return this.createShader(this.gl.VERTEX_SHADER, source);
    }

    public createFragmentShader(source: string): WebGLShader {
        return this.createShader(this.gl.FRAGMENT_SHADER, source);
    }

    public createShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error("Shader failed to load");
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader!;
        } else {
            console.log(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            throw new Error("Shader failed to load");
        }
    }

    public createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = new GlProgram(this.gl);
        program.attachShader(vertexShader).attachShader(fragmentShader);
        const success = program.link();
        if (success) {
            return program;
        } else {
            console.log(this.gl.getProgramInfoLog(program.program));
            this.gl.deleteProgram(program.program);
            throw new Error("Program failed to run");
        }
    }

    public resizeCanvasToDisplaySize(): boolean {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth  = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize = this.canvas.width  !== displayWidth ||
            this.canvas.height !== displayHeight;

        if (needResize) {
            // Make the canvas the same size
            this.canvas.width  = displayWidth;
            this.canvas.height = displayHeight;
        }

        return needResize;
    }

    public clear() {
        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}

export class GlProgram {
    public readonly program: WebGLProgram;
    private readonly gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.program = gl.createProgram()!;
    }

    public attachShader(shader: WebGLShader): GlProgram {
        this.gl.attachShader(this.program, shader);
        return this;
    }

    public link() {
        this.gl.linkProgram(this.program);
        return this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    }

    public use() {
        this.gl.useProgram(this.program);
    }

    public getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.gl.getUniformLocation(this.program, name);
    }

    public getAttribLocation(name: string): number {
        return this.gl.getAttribLocation(this.program, name);
    }
}

export class GlBuffer {
    private readonly buffer: WebGLBuffer;
    private readonly gl: WebGLRenderingContext;
    private readonly bufferType: number;

    constructor(gl: WebGLRenderingContext, bufferType: number = gl.ARRAY_BUFFER) {
        this.buffer = gl.createBuffer()!;
        this.gl = gl;
        this.bufferType = bufferType;
    }

    public bindBuffer() {
        this.gl.bindBuffer(this.bufferType, this.buffer);
    }

    public bufferData(data: any, dataType: number) {
        this.bindBuffer();
        this.gl.bufferData(this.bufferType, data, dataType);
    }
}
