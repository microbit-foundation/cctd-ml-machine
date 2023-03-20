# Micro:Bit C++ version

## Dependencies

We use the tool yotta to build. (Read more : https://lancaster-university.github.io/microbit-docs/offline-toolchains/)
### Installing yotta (OS X)

Source: http://docs.yottabuild.org/#installing (see for other platforms)

Install using the following commands

`brew tap ARMmbed/homebrew-formulae`

`brew install python cmake ninja arm-none-eabi-gcc`

`pip install yotta` or `pip3 install yotta`

**Xcode compiler**

`xcode-select --install`

### srecord (OS X)

Source: https://lancaster-university.github.io/microbit-docs/offline-toolchains/ (see for other platforms)

`brew install srecord`

### Docker image
In order to compile, a docker image is used.

`docker pull ghcr.io/carlosperate/microbit-toolchain:latest`



## Configurations
### Yotta
**Yottas registry is deprecated!** This means we have to acquire the build target (bbc-microbit-classic-gcc) elsewhere. Lancaster University has provided a link that will replace the yotta registry. 

In `./.yotta.json` we configure:

```json
{
  "build": {
    "target": "bbc-microbit-classic-gcc,https://github.com/lancaster-university/yotta-target-bbc-microbit-classic-gcc"
  }
}
```

`./.yotta_ignore` contains the items that will be excluded from the build.

We can then select the build target with (optional, but does produce a warning if not explicitly selected.)

```yotta target bbc-microbit-classic-gcc```

**Note!** When changing the target using the command above, you must have acquired the build target from lancaster, otherwise you have to copy the `./.yotta.json` file above in order to download it.

### Configuring the MicroBit

In the root of the project the file `./config.json` we have the configurations for the MicroBit, allowing us to enable Bluetooth. In the `./source/examples` folder we find example configs. These must be placed at the root of the project to be included at build time.

## Building the project

We use yotta and the docker image provided to build the project

`docker run -v $(pwd):/home --rm ghcr.io/carlosperate/microbit-toolchain:latest yotta build`

Doing this will create the file `./build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex`. This is the hex that will be flashed to the microbit

**Note!** When we build we use the target provided in `.yotta.json`. By default, it is using a github repository to download. Github has hourly limits, so frequently deleting folders `yotta_modules` and `yotta_targets` may cause these limits to be reached, and prevent further downloads until the limit has expired. 


## Flashing the .hex

Copy the file `./build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex` to the microbit to flash

With macos command:

```cp /<PATH TO PROJECT>/build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex /Volumes/MICROBIT```


## Sources


### Yotta installation

http://docs.yottabuild.org/#installing

### Microbit docs

https://lancaster-university.github.io/microbit-docs/offline-toolchains/

https://lancaster-university.github.io/microbit-docs/

### Docker image

https://github.com/carlosperate/docker-microbit-toolchain

### Code examples for C++

https://github.com/lancaster-university/microbit-samples


## Developer notes

I recommend creating a bash file that both builds and flashes the build to the microbit.

example:

```bash
# compile and run

docker run -v $(pwd):/home --rm ghcr.io/carlosperate/microbit-toolchain:latest yotta build

cp /Users/<USER>/Ceed/microbit-cpp/build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex /Volumes/MICROBIT

```