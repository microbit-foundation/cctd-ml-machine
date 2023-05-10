# ML-Machine

ML-Machine is a free and open-source interactive machine-learning platform, utilising external sensors to generate data,
which it can be trained to recognise. This allows for gesture recognition by recording examples of gestures performed by
the user, which the platform can learn and subsequently recognise. The external sensors are provided by the micro:bit
boards, which are communicated with through Bluetooth. When a gesture is recognised an auditory, visual or logical
feedback action is taken.

To learn to recognise a gesture, a label is created for which a set of example movements with the micro:bit
is recorded. These recordings will be processed by a machine-learning algorithm to recognise future examples. To
differentiate the recording and feedback process we allow for two micro:bits to be connected. One will act as a
recording, or input device and another will act as feedback, or output device.

## Using ML-Machine

ML-Machine can be found at [ML-Machine.org](https://ml-machine.org/) free to use.
Using the platform requires at least one micro:bit, but two is recommended, especially if you are planning on using any
of the I/O feedback.

### Connecting your micro:bit

The micro:bit can be connected via Bluetooth. The micro:bit requires a specific firmware to be able to communicate with
the platform effectively. The firmware can be acquired as a .hex file which can be manually transferred using your PC's
file system, alternatively, if the micro:bit is connected via USB the platform can automatically upload the firmware to
the micro:bit directly.

### Creating gestures and recording examples

To create a gesture go to the data tab through the menu on the left side of the page. Then click the big plus icon to
create an empty gesture and give it a title.

To record an example ensure that a micro:bit has been connected and select the newly created gesture. Press either of
the buttons in the micro:bit and perform the gesture you wish to recognise immediately. You can do this as many times as
you would like. The more example you give for the gesture, the more confident the algorithm will be in recognising the
gesture in the future.

### Training the model

To train the predictive model on the given gesture examples, go to the trainer tab of the menu. Select the train model
option and wait until it has finished. The time this takes is dependent on how many examples you gave each gesture and
how many gestures the model has to learn.

### Recognising gestures

The model will attempt to predict which gesture is being performed immediately after training. Go to the model tab to
configure the feedback actions, which will be taken when the model makes a prediction.

### Configuring prediction and feedback

In the model tab several options become available once the model has been trained. These can be changed to alter the
behaviour of the platform and micro:bits.

#### Confidence threshold

Determines how confident the model has to be for a feedback action to be taken for the given gesture. This is a slider
located to the right of the label and can be adjusted to make the model more sensitive, the default value is 90%, and
can be changes for each gesture.

Immediately besides it, a confidence-meter shows how confident the model currently is and will change as you perform
gestures.

#### Changing the LEDs for output micro:bit

Determines which LEDs on the display of the micro:bit will be lit up when the gesture is detected. This is

#### Sound feedback

Determines which sound clip will be played when a gesture is recognised. Depending on which version of micro:bit you
have, the sound will be output on the speaker of the micro:bit or on your computer, if the micro:bit doesn't support
speaker audio.

#### I/O feedback

Select the I/O pin you wish to turn on in response to a gesture detection. Combine this with circuitry to make gesture
recognition perform actions outside the platform such as turning on motors or LEDs.

### Getting started locally

Alternatively the software can be run locally on your computer without compromising the capabilities of the software.

Running the platform locally requires the package manager [npm](https://www.npmjs.com/)

1. Download or clone this repository
2. In the terminal, run command `npm install` inside the project directory.
3. Once installed, run `npm run dev` to launch the application.
4. Access the application from http://localhost:5173/

### Dependencies

ML-Machine utilises several packages, most notable of which are the following:

- [Svelte](https://github.com/sveltejs/svelte) provides the web-development framework.
- [Windi CSS](https://github.com/windicss/windicss) provides our styling tool.
- [ml5.js](https://github.com/ml5js/ml5-library) provides machine learning capabilities.
- [Smoothie Charts](https://github.com/joewalnes/smoothie) and [chart.js](https://github.com/chartjs/Chart.js) provides
  a visualisation kit.

## Contributions

### Contributing

#### Issues

If you experience an issue or have a question regarding the platform please do not hesitate to raise an issue. The
maintainers will answer to any issues raised as quickly as possible.

#### Code contributions

If you have an improvement on you wish to share with please read the [contributing](CONTRIBUTING.md) page. There you
will find information about how to contribute. The maintainers will review the changes as soon as possible.

### Credits

ML-Machine is a platform created by the Center for Computational Thinking and Design (see [CCTD.dk](https://cctd.dk)) at Aarhus University for empowering education in the emerging fields of technology and computation.

## License

[MIT](license) © Center for Computational Thinking and Design, Aarhus University