import { model } from "./stores/mlStore";
import { get } from 'svelte/store'
import { compileModel } from "ml4f";
import MemoryMap from 'nrf-intel-hex'
import Microbits from "./microbit-interfacing/Microbits";

export async function generateModel() {
  const no_model_hexfile = 'firmware/MICROBIT_NO_MODEL.hex'
  const model_base = 0x40000

  // Retrieve model_meta.json
  var meta = get(model).neuralNetworkData.meta

  // Turn normalisation buffers into bytes
  const bufs = findValues(meta)
  const maxbufs = bufs[0]
  const minbufs = bufs[1]
  const max_bytes = convertBuffers(maxbufs)
  const min_bytes = convertBuffers(minbufs)
  
  // Retrieve and compile trained model using ml4f
  let trained_model = get(model).neuralNetwork.model;
  const cres = compileModel(trained_model, {})

  // Retrieve MICROBIT_NO_MODEL (located in public/firmware)
  const hexFile: Response = await fetch(no_model_hexfile);
  const hexstring_no_model = await hexFile.text()

  // Splice hexfiles together
  const memoryMap = MemoryMap.fromHex(hexstring_no_model)
  memoryMap.set(model_base, new Uint8Array(max_bytes))
  memoryMap.set(model_base + 4 * maxbufs.length, new Uint8Array(min_bytes))
  memoryMap.set(model_base + 2 * 4 * maxbufs.length, cres.machineCode)
  
  
  const hexfile_with_model = memoryMap.asHexString()
  console.log(hexfile_with_model)
  downloadToDevice(hexfile_with_model)

  // get(model).save()
}

// Download hexfile to microbit (without flashing it)
function downloadToDevice(hex: string) {
  const finished_model_name = 'MICROBIT.hex'
  const blob = new Blob([hex], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', finished_model_name);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
}

function convertBuffers(buf: number[]): ArrayBuffer {
  const bytes = new ArrayBuffer(4 * buf.length) // Size of int8 is 4
  const max_view = new DataView(bytes)
  for (let i = 0; i < buf.length; i++) {
    max_view.setFloat32(i * 4, buf[i], true)
  }
  return bytes
}

function findValues(json: any): [Array<number>, Array<number>] {

	// Is there a better way to test if a field is JSON?
	function isJson(x: any) {
		return (x === Object(x) && !Array.isArray(x))
	}

	function traverse(string: any) {
		for (var key in string) {
			if (isJson(string[key])) {
				traverse(string[key])
			} else {
				if (key === 'max') {
					maxs.push(string[key])
				} else if (key === 'min') {
					mins.push(string[key])
				}

			}
		}
	}
	
	const maxs: Array<number> = [];
	const mins: Array<number> = [];
	traverse(json)
	// Remove last value
	maxs.pop()
	mins.pop()
	return [maxs,mins]
}