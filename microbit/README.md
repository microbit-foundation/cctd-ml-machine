# micro:bit program sources

This folder contains the micro:bit software, that enables the micro:bit to interact with the webapplication.

Both v1 and v2. micro:bits have separated folders for source code.
Inside each folder is an instruction on the build process, as the build tools needed are not the same.

### What if i want to alter the micro:bit software?
Navigate into the version you wish to change and follow the instructions. 
There will be a comprehensive guide on how to install the build tools. All the code has accompanying documentation
in an effort to make it as easy as possible to change the behaviour of the micro:bit.

#### Universal hex
Once changes have been applied in both micro:bit versions we recommend creating a universal hex file, using this [tool from microbit.org](https://tech.microbit.org/software/universal-hex-creator/).

We create universal hex files if users have to manually download and transfer them, as universal hex files cannot be flashed using the DAPLink interface.