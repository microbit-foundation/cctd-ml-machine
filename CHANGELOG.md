# Change log

Notable changes to the project will be archieved here


## [1.8.1](https://gitlab.au.dk/au-cs-ceed/ml-microbit-browser/-/releases/v1.8.1) - 11/01 - 2023
Fixes some problems after reaching feature parity between DR and master release branches

### Changed
- Removes ID field from menu properties
- Moved management of menus out of svelte components

### Fixed
- Fixed type errors and warnings for graph components
- Cookie banner can now select language
- Fixed a bug with predictions causing NaN confidence

## [1.8.0](https://gitlab.au.dk/au-cs-ceed/ml-microbit-browser/-/releases/v1.8.0) - 22/12 - 2022
Jest has been introduced! And with it comes the promise of stability.  In addition, some graphical and translation issues has been addressed.

### Added
- Jest has been introduced (see `src/__tests__/` for examples on how they work)
- Tests for finding unused translations
- Tests for inconsistencies in the translations, such as having to include both an english and danish translation of a phrase.
- Both english and danish translations must be of equal length

### Fixed
- Thanks to jest we have found several issues with the translation, which has been addressed, including removing unused/redundant translations
- The highlights on the pattern matrix now disappears when moving outside the drawing area.

## [1.7.0](https://gitlab.au.dk/au-cs-ceed/ml-microbit-browser/-/releases/v1.2.0) - 1/12 - 2022
Jest has been introduced! And with it comes the promise of stability.  In addition, some graphical and translation issues has been addressed.

### Added
- Jest has been introduced (see `src/__tests__/` for examples on how they work)
- Tests for finding unused translations
- Tests for inconsistencies in the translations, such as having to include both an english and danish translation of a phrase.
- Both english and danish translations must be of equal length

### Fixed
- Thanks to jest we have found several issues with the translation, which has been addressed, including removing unused/redundant translations
- The highlights on the pattern matrix now disappears when moving outside the drawing area.

## [1.6.0](https://gitlab.au.dk/au-cs-ceed/ml-microbit-browser/-/releases/v1.1.0) - 22/11 - 2022
Introduces a new pairing pattern system
### Added
- Pairing pattern now automatically fills out squares beneath the targeted square. In addition it outlines any squares below the one that is currently being hovered over.
- The ConnectionBehaviour callback promptOpen is now fired when the connection prompt opens.

### Fixed
- The information icon is now fixed in place on recorded gestures. Before it would move when scrolling the page
- Spinning icon no longer escapes the menu box after a model has been trained.
- Information icons no longer have higher z-index priority over the control-bar
- Failed connectivity errors that would occur when the micro:bit was successfully connected but loses connection before adding the listener to the services such as accelerometer are now caught and display a 'connection failed' message.
- Added some missing translations for prompts when deleting tests/gestsures
- Reduced the overflow issue that would cause the left hand side menu to overflow when testcenter was open on chromebooks. It is still an issue, but now the home button is accessible.
- Swapped the outline on the bottom input graph for a border, since it caused some graphical issues due to it being placed outside the container.

## [1.5.0](https://gitlab.au.dk/au-cs-ceed/ml-microbit-browser/-/releases/v1.0.1) - 17/11 - 2022
Welcome Jon, who has joined the project.

This version was created to improve stability and transitioning the micro:bit firmware from MakeCode to C++. The C++ firmware can be found as a repository under the AU CS CEED group.
### Added
- Added Dialog box component for contact information

### Changed
- Removed top bar from DataPage
- Many styling changes to support the upcoming DR-release

### Fixed
- Flashing error handling. Now gives appropriate feedback
- Alignment issues
- Issues only present on chromebook
- Fixed a null pointer exception that was thrown when resizing the overlay on the output page.
- Closed issue where the pairing pattern would sometimes be wrong on the micro:bit. Issue could not be replicated after new HEX file.
- Fixed text alignment issue on the left hand side menus. Text was not align vertically to the center when collapsed.
- Improved solution for handling failed flashes / get friendly name. Now these should be caught with the promise.catch(e) statement.
- Fixed some connectivity issues on the micro:bit. This was caused by using too little power for the transmission component of the BLE.



## [1.4.0] - 6/10 - 2022
This release signifies the last release before the DR-cooperation project starts
### Added
- Added compatibility checking for USB and bluetooth
- Added connect with USB step
- Added skeletal animations

### Changed
- Now allows for multi-line information boxes

### Fixed
- Fixed the model-page no-output overlay issue



## [1.3.0] - 6/10 - 2022

### Added
- Cookie banner and cookie manager
- Introduced a standardized button
- Added Generic Modal
- MicrobitUSB now has an event-emitting implementation
- MicrobitBluetooth can now emit events


### Changed
- Reduced the usage of z-layer or reduced their values, keeping them from going wild
- Completely overhauled the code structure, using less position: absolute

### Fixed
- One can no longer close while transferral is in progress


## [1.2.0] - 1/09 - 2022

### Added
 - Added pairing pattern connection
 - Added new connection flow
 - Added flashing .hex files through USB
 - MBSpecs, a microbit specification file for details such as UUIDs for bluetooth services

### Changed
- Added interfaces that controls input/output seperately through implementation
- Many files converted to TypeScript

### Fixed
- Fixed a bug, that caused failed data loading from localStorage

## [1.1.0] - 30/06 - 2022

### Added
 - Added support for v1 microbits
 - Bluetooth wrapper for interacting with microbits

### Changed
- Magic values replaced by configuration settings

## [1.0.0] - 15/09 - 2021

Initial release of ML-Machine.
