var __require = /* @__PURE__ */ ((x) =>
  typeof require !== 'undefined'
    ? require
    : typeof Proxy !== 'undefined'
      ? new Proxy(x, {
          get: (a, b) => (typeof require !== 'undefined' ? require : a)[b]
        })
      : x)(function (x) {
  if (typeof require !== 'undefined') return require.apply(this, arguments)
  throw Error('Dynamic require of "' + x + '" is not supported')
})

// src/index.ts
var AuthorizationService = class _AuthorizationService {
  constructor() {
    this.initialized = false
    this.wasmInstance = null
    // This will hold the object returned by the Go initAuthService function
    this.goServiceObject = null
  }
  static async init(schema) {
    if (!_AuthorizationService.instance) {
      _AuthorizationService.instance = new _AuthorizationService()
      await _AuthorizationService.instance.initializeWasm()
      const initAuthServiceFunc = globalThis.initAuthService
      if (typeof initAuthServiceFunc !== 'function') {
        throw new Error(
          'initAuthService function not found in WASM module. Ensure WASM loaded correctly.'
        )
      }
      try {
        _AuthorizationService.instance.goServiceObject =
          initAuthServiceFunc(schema)
      } catch (error) {
        console.error('Error calling Go initAuthService function:', error)
        throw new Error(`Failed to initialize Go service: ${error}`)
      }
      if (
        !_AuthorizationService.instance.goServiceObject ||
        typeof _AuthorizationService.instance.goServiceObject.isUserAllowed !==
          'function' ||
        typeof _AuthorizationService.instance.goServiceObject
          .getUserPermissions !== 'function'
      ) {
        console.error(
          'Unexpected object returned by Go initAuthService:',
          _AuthorizationService.instance.goServiceObject
        )
        throw new Error(
          'WASM initAuthService did not return the expected service object structure.'
        )
      }
      _AuthorizationService.instance.initialized = true
    }
    return _AuthorizationService.instance
  }
  // Renamed initialize to initializeWasm to avoid confusion with the static init
  async initializeWasm() {
    if (typeof window !== 'undefined') {
      if (!globalThis.Go) {
        const wasmExecScript = document.createElement('script')
        let scriptSrc = 'http://localhost:3000/gatekeeper/wasm_exec.js'
        try {
          const scriptUrl = new URL(
            'http://localhost:3000/gatekeeper/wasm_exec.js',
            import.meta.url
          )
          scriptSrc = scriptUrl.href
          console.log(
            `Resolved wasm_exec.js path using import.meta.url: ${scriptSrc}`
          )
        } catch (e) {
          console.warn(
            "import.meta.url not supported or failed, falling back to relative path './wasm_exec.js'. Ensure wasm_exec.js is served correctly by your application server/bundler.",
            e
          )
        }
        wasmExecScript.src = scriptSrc
        document.head.appendChild(wasmExecScript)
        await new Promise((resolve, reject) => {
          wasmExecScript.onload = () => {
            console.log(`Successfully loaded ${wasmExecScript.src}`)
            resolve()
          }
          wasmExecScript.onerror = (err) => {
            console.error(
              `Failed to load wasm_exec.js from ${wasmExecScript.src}`
            )
            reject(
              `Failed to load wasm_exec.js from ${wasmExecScript.src}: ${err}`
            )
          }
        })
      }
    } else {
      if (!globalThis.Go) {
        try {
          const path = __require('path')
          __require(path.join(__dirname, './wasm_exec.js'))
        } catch (err) {
          throw new Error(
            `Failed to require wasm_exec.js in Node.js: ${err}. Ensure it's in the dist directory.`
          )
        }
      }
    }
    if (!globalThis.Go) {
      throw new Error('Go class not found after loading wasm_exec.js')
    }
    const go = new globalThis.Go()
    try {
      let wasmModule
      if (typeof window !== 'undefined') {
        const wasmUrl = 'http://localhost:3000/gatekeeper/main.wasm'
        wasmModule = await WebAssembly.instantiateStreaming(
          fetch(wasmUrl),
          go.importObject
        )
      } else {
        const fs = __require('fs')
        const path = __require('path')
        const wasmPath = path.join(__dirname, './main.wasm')
        if (!fs.existsSync(wasmPath)) {
          throw new Error(
            `WASM file not found at ${wasmPath}. Ensure it's copied to the dist directory.`
          )
        }
        const wasmBuffer = fs.readFileSync(wasmPath)
        wasmModule = await WebAssembly.instantiate(wasmBuffer, go.importObject)
      }
      this.wasmInstance = wasmModule.instance
      go.run(this.wasmInstance)
    } catch (error) {
      console.error('Failed to initialize WASM:', error)
      throw error
    }
  }
  isUserAllowed({ user, permission }) {
    if (!this.initialized || !this.goServiceObject) {
      throw new Error(
        'AuthorizationService not initialized. Call and await init() first.'
      )
    }
    try {
      return this.goServiceObject.isUserAllowed(user, permission)
    } catch (error) {
      console.error('Error calling Go isUserAllowed:', error)
      throw new Error(`Error executing WASM isUserAllowed: ${error}`)
    }
  }
  getUserPermissions({ user }) {
    if (!this.initialized || !this.goServiceObject) {
      throw new Error(
        'AuthorizationService not initialized. Call and await init() first.'
      )
    }
    try {
      return this.goServiceObject.getUserPermissions(user)
    } catch (error) {
      console.error('Error calling Go getUserPermissions:', error)
      throw new Error(`Error executing WASM getUserPermissions: ${error}`)
    }
  }
}
var index_default = AuthorizationService
export { AuthorizationService, index_default as default }
//# sourceMappingURL=index.mjs.map
