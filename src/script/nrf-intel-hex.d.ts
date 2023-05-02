declare module 'nrf-intel-hex' {
  export default class MemoryMap {
		asHexString(): string
		set(model_base: number, max_bytes: ArrayBuffer): void 
		static fromHex(intelHexString: string, maxBlockSize?: number | undefined): MemoryMap
  }

  
}