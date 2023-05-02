declare module 'nrf-intel-hex' {
  export class MemoryMap {
		static fromHex(intelHexString: string, maxBlockSize?: number | undefined): MemoryMap
}
}