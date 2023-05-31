export default {
	"da": { // APPROXIMATE SORTING ORDER: First alphabetically, then order of appearance from top to bottom of page
		// ALERTS:
		//In gesture.svelte 
		"alert.data.classNameLengthAlert": "Navne må kun bestå af 25 tegn",
		"alert.recording.disconnectedDuringRecording":"micro:bit frakoblede under optagelse",

		//In common.js
		"alert.isRecording": "Du er i gang med at optage!",
		"alert.isTesting": "Du er i gang med at optage!",
		"alert.isTraining": "Du er i gang med at træne en model!",
		"alert.isNotConnected": "Din Micro:bit skal være tilsluttet!",
		"alert.deleteGestureConfirm": "Er du sikker på at du vil slette klassen ",
		//In ml.ts
		"alert.twoGestures": "Du skal have mindst to klasser",
		"alert.oneDataRepresentation": "Du skal have mindst en data-repræsentation",
		"alert.recordingsPerGesture": "Du skal have mindst tre eksempler for hver klasse",
		// HOME PAGE:
		"content.index.heading": "Gør-det-selv machine learning",
		"content.index.howBody": "Velkommen til 'ultra:bit datatræneren'. Eksperimentér og leg med machine learning og byg dine første machine learning-modeller – kom i gang her!",
		"content.index.ledDescription": "25 LED lys",
		"content.index.recordButtonDescription": "\"Optag\"-knap",
		"content.index.videoHeading": "Introvideo",
		"content.index.setupBody2": "Hjemmesiden benytter bluetooth, accelerometer, LED'er, knapper og lyd fra BBC micro:bit'en. For at hjemmesiden kan tilgå disse, skal der overføres et program til BBC micro:bit'en. Det downloades første gang, du tilslutter BBC micro:bit'en med USB. Efterfølgende kan du blot tilslutte med bluetooth uden at bruge USB-kablet.",
		"content.index.oldVersion": "Du kan finde den gamle version her:",
		"content.index.contactButton": "Kontakt os",
		"content.index.contactBody": "Hvis du finder fejl og mangler på denne platform, skal du være velkommen til at skrive til os. Hvis du har andre efterspørgsler, ideer eller generel interesse, skal du være velkommen til at kontakte os. Skaberne af denne platform kan kontaktes på:",
		"content.index.contactMail": "keb@cs.au.dk",
		"content.index.acknowledgement": "Udviklet af Center for Computational Thinking og Design, Aarhus Universitet",
		// DATA PAGE:
		"content.data.classPlaceholderNewClass": "Klik for at ændre navnet",
		"content.data.record": "Optag",
		"content.data.addData": "Tilføj data",
		"content.data.classHelpHeader": "Klasse",
		"content.data.classHelpBody": "En klasse beskriver en type af bevægelse. Vi kan optage eksempler af en bestemt type bevægelse og putte eksemplerne i samme klasse. Træneren kan finde mønstre i eksemplerne/dataet og bruge disse mønstre til at træne en model, der kan genkende denne type bevægelse. Flere eksmpler vil typisk reulstere i en bedre model, men overvej på hvor mange forskellige måder en bevægelse kan laves.",
		"content.data.classification": "Klasser",
		"content.data.data": "Data",
		"content.data.choice": "Valg",
		"content.data.choice.header": "Valg af klasse",
		"content.data.choice.body": "Her vælger du, hvilken klasse du vil tilføje data til. Efter at du har valgt en klasse at tilføje data til, kan du trykke på \"Optag\" knappen nedenfor, eller på en af knapperne på din micro:bit for at optage et data-segment. Se billedet nedenfor.",
		"content.data.dataDescription": "Her kan du se din indsamlede data. Generelt vil det være en fordel at have mere data, da dette giver lærings-algoritmen mere infomration at lære ud fra.",
		"content.data.addDataNoConnection": "Du kan ikke tilføje data, uden at være tilsluttet en micro:bit",
		"content.data.noData": "Du har ingen bevægelser at træne med. Tilføj nogle bevægelser, som du vil træne din BBC micro:bit til at genkende.",

		"content.data.controlbar.button.clearData": "Ryd eksempler",
		"content.data.controlbar.button.clearData.confirm": "Er du sikker på at du vil slette alle eksempler?\nDette kan ikke fortrydes.",
		"content.data.controlbar.button.downloadData": "Download dataset",
		"content.data.controlbar.button.uploadData": "Upload dataset",


		// TRAINER PAGE:
		"content.trainer.failure.header": "Træning mislykkedes",
		"content.trainer.failure.body": "Træningen resulterede ikke i en brugbar model. Grunden til dette ligger sandsynligvis i dataet. Hvis dataet i forskellige klasser minder for meget om hinanden, kan dette resultere i nogle forskellige problemer i træningsprocessen, der ikke gør det muligt at træne modellen ordentligt.",
		"content.trainer.failure.todo": "Gå tilbage til datasiden og ændr i din data.",

		// MODEL PAGE:
		"content.model.trainModelFirstHeading": "Træn modellen først!",
		"content.model.trainModelFirstBody": "Gå til 'Træner'-siden",
		"content.model.classification.helpHeading": "Sandsynligheds-meteret",
		"content.model.classification.helpBody": "For hver forudsigelse, vil modellen producere et procent-tal, der beskriver hvor sikker modellen er i sin fordusigelse. Dette meter går fra 0% til 100%. Med slideren ved siden af, kan du bestemme grænsen for, hvor sikker modellen skal være i sin forudsigelse for at lave et output (fx afspille en lyd)",
		"content.model.output.soundOptionCongratulations": "Tillykke",
		"content.model.output.soundOptionHighPitchBeep": "Højtone Bip",
		"content.model.output.soundOptionLowPitchBeep": "Lavtone Bip",
		"content.model.output.soundOptionLoser": "Taber",
		"content.model.output.soundOptionMistake": "Fejl",
		"content.model.output.soundOptionHugeMistake": "Kæmpe fejl",
		
		"content.model.output.pin.option.allTime": "Tændt hele tiden",
		"content.model.output.pin.option.xTime": "Tændt i X sekunder",
		"content.model.output.pin.seconds": "Sekunder",

		"content.model.output.prediction.iconTitle": "Forudsigelse",
		"content.model.output.prediction.descriptionTitle": "Forudsigelse",
		"content.model.output.prediction.descriptionBody": "Her kan du se, hvilken klasse din model forudsiger den nuværende bevægelse til at være. Du kan se i meteret hvor sikker modellen er i sin forudsigelse.",

		"content.model.output.ledOutput.descriptionTitle": "LED output",
		"content.model.output.ledOutput.descriptionBody": "Her kan du vælge, hvordan LED-lysene på din output-micro:bit skal opføre sig, når din model forudsiger en klasse. Prøv at tegne nogle mønstre nedenfor og se, hvordan disse mønstre vises på din output-micro:bit, når du bevæger input-micro:bit'en.",

		"content.model.output.sound.iconTitle": "Lyd",
		"content.model.output.sound.descriptionTitle": "Afspilling af lyd",
		"content.model.output.sound.descriptionBody": "Her kan du vælge hvilken lyd din output-micro:bit skal afspille, når din model laver en forudsigelse. Bemærk at lyden afspilles af din computer, hvis du har en micro:bit version 1.",

		"content.model.output.pin.iconTitle": "Pin",
		"content.model.output.pin.descriptionTitle": "Pin output",
		"content.model.output.pin.descriptionBody": "Her kan du vælge hvilken pin skal tænde når modellen laver en forudsigelse på en bevægelse. Alle pins har numre i overenstemmelse med micro:bits officielle pin diagram.",

		"content.model.output.popup.header": "Tilslut output-micro:bit",
		"content.model.output.popup.body": "Hvis du ikke har tilsluttet en output-micro:bit, kan du ikke se resultatet af de ændringer du laver på denne side. Tilslut nedenfor.",
		// FOOTER:
		"footer.connectButtonNotConnected": "Tilslut din BBC micro:bit",
		"footer.disconnectButton": "Frakobl",
		"footer.helpHeader": "Live graf",
		"footer.helpContent": "Når du har forbundet en micro:bit kan du live se Accelerometer-data for alle tre akser på denne graf. Prøv at bevæge din forbundende micro:bit og se, hvordan den data der produceres af bevægelserne ser ud for computeren!",
		"footer.reconnecting":"Genopretter forbindelsen. Vent venligst",
		//DATA MENU:
		"menu.data.helpHeading": "Data",
		"menu.data.helpBody": "For at træne en model til at genkende forskellige bevægelser, skal vi have gode eksempler på 'god opførsel', som vi kan vise træneren. Her kan i oprette klasser (en type bevægelse) og optage eksempler til hver klasse. Der skal være mindst 2 klasser med hver 3 eksempler før træneren kan træne en model.",
		"menu.data.examples": "eksempler",
		// TRAINER MENU:
		"menu.trainer.helpHeading": "Træner",
		"menu.trainer.helpBody": "Træneren kigger på eksemplerne i klasserne og forsøger at 'lære', hvordan de forskellige klasser kan genkendes ved at finde mønstre i dataet. Her kan i træne en model, der kan genkende forskellige bevægelser.", //Derudover kan i indstille træneren, vælge hvordan træneren skal forstå dataet og oprette test-sæt.",
		"menu.trainer.notConnected1": "Du har ikke tilkoblet en BBC micro:bit.",
		"menu.trainer.notConnected2": "Gør dette vha. knappen nedenfor",
		"menu.trainer.notEnoughDataHeader1": "Ikke nok data!\nGå til Data-siden",
		"menu.trainer.notEnoughDataInfoBody": "Der er brug for minimum 2 klasser med 3 eksempler i hver for at kunne træne en model.",
		"menu.trainer.notEnoughDataInfo": "Du har ikke indsamlet nok data til at træne en model. Der er brug for minimum 2 klasser med 3 eksempler i hver. Gå til Data-siden for at indsamle mere data",
		"menu.trainer.trainModelButton": "Træn model",
		"menu.trainer.trainNewModelButton": "Træn en ny model",
		"menu.trainer.TrainingFinished": "Træning færdig",
		"menu.trainer.TrainingFinished.body": "Gå til Model-siden for at undersøge hvor godt din model virker",
		"menu.trainer.isTrainingModelButton": "Træner model...",
		// MODEL MENU:
		"menu.model.helpHeading": "Model",
		"menu.model.helpBody": "Modellen kan bruges i et interaktivt system. Her bruger vi den trænede model til at forudsige bevægelser. Du kan tilslutte endnu en micro:bit og få den til at reagere på de bevægelser du laver.",
		"menu.model.noModel": "Ingen model",
		"menu.model.connectOutputButton": "Tilslut output-micro:bit",
		"menu.model.disconnect": "Frakobl output-micro:bit",
		//CONNECT MICROBIT POP UP:

		"popup.connectMB.main.bluetooth.subtitle": "Tilslut med Bluetooth",

		"popup.connectMB.bluetooth.heading": "Tilslut med Bluetooth",
		"popup.connectMB.bluetooth.cancelledConnection": "Du anullerede forbindelses-processen. Prøv igen hvis du ønsker at fortsætte.",
		"popup.connectMB.bluetooth.step0": "Tilslut et batteri til din BBC micro:bit",
		"popup.connectMB.bluetooth.step1": "Tegn mønstret du ser på BBC micro:bit'en",
		"popup.connectMB.bluetooth.step2": "Tryk på knappen nedenfor.",
		"popup.connectMB.bluetooth.step3": "Vælg din BBC micro:bit og tryk 'tilslut'.",
		"popup.connectMB.bluetooth.connect": "Tilslut",
		"popup.connectMB.bluetooth.connecting": "Tilslutter...",

		"popup.disconnectedWarning.input": "Din input-micro:bit mistede forbindelsen, vil du prøve igen?",
		"popup.disconnectedWarning.output": "Din output-micro:bit mistede forbindelsen, vil du prøve igen?",
		"popup.disconnectedWarning.reconnectButton.input": "Tilslut input igen",
		"popup.disconnectedWarning.reconnectButton.output": "Tilslut output igen",

		// NEW CONNECTION PROMPTS - TODO: Rename, merge with above and clean up

		"connectMB.main.usbHeader": "DOWNLOAD PROGRAM TIL BBC MICRO:BIT",
		"connectMB.main.btHeader": "TILSLUT DIN BBC MICRO:BIT VIA BLUETOOTH",
		"connectMB.main.usbBody": "Hvis du ikke tidligere har downloadet programmet",
		"connectMB.main.btBody": "Hvis du allerede har downloadet programmet",
		"connectMB.main.connectButton": "Tilslut",
		"connectMB.main.installButton": "Download",

		"connectMB.output.header": "En micro:bit er allerede forbundet",

		"connectMB.usb.header": "DOWNLOAD PROGRAM TIL BBC MICRO:BIT",
		"connectMB.usb.body1": "Tilslut din BBC micro:bit med USB-kabel og tryk på 'næste'",
		"connectMB.usb.body2": "Tryk 'Find USB-enhed' og vælg 'BBC micro:bit CMSIS-DAP' eller 'DAPLink CMSIS-DAP' fra popup-beskeden som kommer",
		"connectMB.usb.button1": "Næste",
		"connectMB.usb.button2": "Find USB-enhed",
		"connectMB.usb.pleaseWait": "Vent venligst. Downloader program til micro:bit'en",
		"connectMB.usb.done.body1": "Færdig - programmet er downloadet.",
		"connectMB.usb.done.body2": "Du kan nu tilkoble dig via bluetooth.",
		"connectMB.usb.done.body3": "Hvis du har et batteri til din micro:bit kan du nu tage usb-kablet ud og tilslutte batteriet i stedet.",
		"connectMB.usb.done.body4": "Hvis du ikke har et batteri kan du fortsætte med at give din micro:bit strøm igennem usb-kablet.",

		"connectMB.usb.manual.header": "Overfør fil til din BBC microbit",
		"connectMB.usb.manual.manualDownload": "Hvis filen ikke downloadede automatisk tryk",
		"connectMB.usb.manual.manualDownloadLink": "her",
		"connectMB.usb.manual.done": "Færdig: Tilslut med bluetooth",

		"connectMB.usb.firmwareBroken.warning":"Vi opdagede en fejl med din micro:bit",
		"connectMB.usb.firmwareBroken.content1":"Din version af micro:bit og firmware har velkendte fejl, som forhindre os i at uploade programmet til din micro:bit.",
		"connectMB.usb.firmwareBroken.content2":"For at fortsætte nu skal du overføre programmet manuel eller opdatere din micro:bit",
		"connectMB.usb.firmwareBroken.content3":"Vi anbefaler at du opdatere din micro:bit's firmware version til den nyeste for rette op på denne fejl.",
		"connectMB.usb.firmwareBroken.content4":"Du kan finde en guide til hvordan du gør på ",
		"connectMB.usb.firmwareBroken.content4.website":"micro:bit fondens hjemmeside",
		"connectMB.usb.firmwareBroken.button.skip":"Spring over og overfør manuelt",

		"connectMB.outputMB.same": "Brug samme BBC micro:bit",
		"connectMB.outputMB.different": "Tilslut anden BBC micro:bit",
		"connectMB.outputMB.sameButton": "Samme",
		"connectMB.outputMB.otherButton": "Anden",


		// COOKIE BANNER

		"cookies.banner.title": "Cookie politik",
		"cookies.banner.subtitle": "Forbrug og analyse",
		"cookies.banner.text.pleaseHelp": "Hjælp os med at forbedre siden! Tillad cookies for at hjælpe os.",
		"cookies.banner.text.description": "Her hos ML-Machine bruger vi cookies for at indsamle information omkring forbrug af siden. Uden disse cookies er vi ikke i stand til at se hvordan vores side bliver brugt.",
		"cookies.banner.text.readMore": "Du kan læse mere omkring vores cookie politik ",
		"cookies.banner.text.readMore.here": "her",
		"cookies.banner.buttons.reject": "Afvis",
		"cookies.banner.buttons.accept": "Accepter",

		"cookies.overlay.title": "Cookie politik",

		"cookies.overlay.question.whatAreCookies": "Hvad er cookies?",
		"cookies.overlay.question.ourReasoning": "Hvad bruger vi cookies til?",
		"cookies.overlay.question.storageDuration": "Hvor lang tid gemmer vi cookies?",
		"cookies.overlay.question.deleting": "Hvordan sletter man cookies?",
		"cookies.overlay.question.consentChange": "Hvordan ændrer jeg mit samtykke?",

		"cookies.overlay.answer.whatAreCookies": "Cookies er små filer med informationer, som der bliver gemt på den enhed du bruger til at browse med. Det er ikke programmer, som kan indeholder malware eller vira.",
		"cookies.overlay.answer.ourReasoning": "Vi bruger cookies for at indsamle information omkring forbrug af siden. Uden disse cookies er vi ikke i stand til at se hvordan vores side bliver brugt. Du gør derfor os en stor tjeneste ved at give samtykke til cookies.",
		"cookies.overlay.answer.storageDuration": "Det varier fra side til side og udnyttelsen af cookie'en. Nogle cookies bliver gemt indtil du forlader siden, andre bliver gemt i længere perioder. Alle vores cookies bliver gemt i et år.",
		"cookies.overlay.answer.deleting": "Det er forskelligt fra browser til browser. Her er dog en liste af manualer til de mest populære browsere.",
		"cookies.overlay.answer.consentChange": "På nuværende tidspunkt har du endnu ikke givet samtykke, men når du gør kan du blot slette din cookie, hvis du ønsker at trække samtykke tilbage eller på andenvis ombestemmer dig.",

		"cookies.overlay.table.title": "Cookies som vi bruger",
		"cookies.overlay.table.header.description": "Beskrivelse",

		"cookies.overlay.table.row.ai_user.description": "Brugt af Microsoft Application Insights til at indsamle statistisk data omkring forbrug. Den gemmer derudover et unik identifikationsnummer, som bruges til at genkende dig næste gang du amkommer på siden. Den gemmer ikke noget personligt omkring dig, og genererer et identifikationsnummer tilfældigt.",
		"cookies.overlay.table.row.ai_session.description": "Gemmer dit nuværende besøg, så vi kan genkende dig på tværs af vores sider.",
		"cookies.overlay.table.row.cookie_consent.description": "Gemmer dine samtykkevalg af vores cookie politik.",

		// COMPATIBILITY WARNING
		"popup.compatibility.bluetooth.header": "Browser ikke understøttet!",
		"popup.compatibility.bluetooth.explain": "Din nuværende browser understøtter ikke bluetooth. Bluetooth bruges til at drive siden. Uden det virker den ikke.",
		"popup.compatibility.bluetooth.advice": "Sikre at din browser er opdateret. Ellers kan du vælge en af de nedestående browsere, som understøtter bluetooth.",

		"popup.connectMB.USBCompatibility.transferStep.step1": "Åben placering af den firmware fil du lige har downloadet. Den findes oftest i din download mappe.",
		"popup.connectMB.USBCompatibility.transferStep.step2": "Træk filen over i micro:bit'en gennem din computers stifinder.",
		"popup.connectMB.USBCompatibility.transferStep.step3": "Når overførslen er færdig, kan du tilslutte din micro:bit med Bluetooth.",

		"compatibility.platform.notSupported": "Værktøjet er ikke understøttet på din nuværende platform.",
		"compatibility.platform.notSupported.joinDesktop": "Vi ses på computer.",
		"compatibility.webgl.notSupported": "WebGL er ikke tilgængelig. Aktiver WebGL for at se 3D data.",

		// CONNECTION LOST DIALOG

		"dialog.connection.lost.header": "Forbindelse offline",
		"dialog.connection.lost.body": "Vi kan ikke oprette forbindelse til internettet, nogle funktioner virker muligvis ikke som forventet."

	},
	"en": {
		// ALERTS:
		//In gesture.svelte
		"alert.data.classNameLengthAlert": "Names must consists of maximum 25 characters.",
		"alert.recording.disconnectedDuringRecording":"micro:bit disconnected during recording",

		//In common.js
		"alert.isRecording": "You are currently recording!",
		"alert.isTesting": "You are currently recording!",
		"alert.isTraining": "You are currently training a model!",
		"alert.isNotConnected": "Your Micro:bit should be connected!",
		"alert.deleteGestureConfirm": "Are you sure you want to delete the class ",
		//In ml.ts
		"alert.twoGestures": "You need at least two classes",
		"alert.oneDataRepresentation": "You need at least one data representation",
		"alert.recordingsPerGesture": "You need at least three examples per class",
		// HOME PAGE:
		"content.index.heading": "Do It Yourself Machine Learning",
		"content.index.howBody": "Welcome to the ultra:bit data trainer. Experiment and play with machine larning and build your first machine learning models - start here!",
		"content.index.ledDescription": "25 LED lights",
		"content.index.recordButtonDescription": "\"Record\"-button",
		"content.index.videoHeading": "Intro Video",
		"content.index.setupBody2": "The website utilizes the bluetooth, accelerometer, LEDs, buttons, and sounds from the Micro:bit. Subsequetnly, you can connect the micro:bit to your computer via bluetooth without using the USB cable.",
		"content.index.oldVersion": "You can finde the old version here:",
		"content.index.contactButton": "Contact us",
		"content.index.contactBody": "If you find errors and omissions on this platform, please feel free to write us. If you have any other requests, ideas or general interests, please feel free to contact us. The creators of this platform can be contacted at:",
		"content.index.contactMail": "keb@cs.au.dk",
		"content.index.acknowledgement": "Developed by Center for Computational Thinking and Design, Aarhus University",
		// DATA PAGE:
		"content.data.classPlaceholderNewClass": "Press here to change name",
		"content.data.record": "Record",
		"content.data.addData": "Add Data",
		"content.data.classHelpHeader": "Class",
		"content.data.classHelpBody": "A class describes a type of gesture. We can record examples of a certain type of gesture and put the examples in the same class. The trainer can find patterns in the examples/data and use these patterns to 'train' a model that can recognize this class of gestures. Multiple examples will typically result in a better model, and consider how many different ways a gesture can be performed.",
		"content.data.classification": "Classes",
		"content.data.data": "Data",
		"content.data.choice": "Choice",
		"content.data.choice.header": "Choice of class",
		"content.data.choice.body": "Here, you choose which class you want to add data to. After having selected a class, you can either press the \"Record\" button below or press one of the buttons on your micro:bit to record a data segment. See the picture below.",

		"content.data.dataDescription": "Here you can see the gathered data. ",
		"content.data.addDataNoConnection": "You cannot add data without being connected with a micro:bit",
		"content.data.noData": "You do not have any gestures to train on. Add the gestures you wish the micro:bit should learn to recognise.",

		"content.data.controlbar.button.clearData": "Clear examples",
		"content.data.controlbar.button.clearData.confirm": "Are you sure you wish to delete all gesture examples?\nThis cannot be undone.",
		"content.data.controlbar.button.downloadData": "Download dataset",
		"content.data.controlbar.button.uploadData": "Upload dataset",

		// TRAINER PAGE:
		"content.trainer.failure.header": "Training Failed",
		"content.trainer.failure.body": "The training did not result in a usable model. The reason for this is most likely the data used for training. If the data for different classes are too similar, this can result in issues in the training process.",
		"content.trainer.failure.todo": "Return to the data page and change your data.",
		// MODEL PAGE:
		"content.model.trainModelFirstHeading": "Train the model first!",
		"content.model.trainModelFirstBody": "Go to the 'Trainer' page",
		"content.model.classification.helpHeading": "Probabil-ometer",
		"content.model.classification.helpBody": "For each prediction you make, the model will produce a percentage that describes how confident the model is in its prediction. This meter goes from 0% to 100%. With the slider next to it, you can determine the limit of how certain the model should be in its preduction to make an output (e.g. play a sound)",
		"content.model.output.soundOptionCongratulations": "Congratulations",
		"content.model.output.soundOptionHighPitchBeep": "High pitch beep",
		"content.model.output.soundOptionLowPitchBeep": "Low pitch beep",
		"content.model.output.soundOptionLoser": "Loser",
		"content.model.output.soundOptionMistake": "Mistake",
		"content.model.output.soundOptionHugeMistake": "Huge Mistake",

		"content.model.output.pin.option.allTime": "On while predicted",
		"content.model.output.pin.option.xTime": "On for X amount",
		"content.model.output.pin.seconds": "Seconds",

		"content.model.output.prediction.iconTitle": "Prediction",
		"content.model.output.prediction.descriptionTitle": "Prediction",
		"content.model.output.prediction.descriptionBody": "Here you can see the model's prediction of the current gesture. In the meter, you can see how confident the model is in the prediction.",

		"content.model.output.ledOutput.descriptionTitle": "LED output",
		"content.model.output.ledOutput.descriptionBody": "Here you can choose how the LEDs on your output micro:bit behaves when your model makes predictions. Try draw some patterns and see how they show on the output micro:bit when you move the input micro:bit.",

		"content.model.output.sound.iconTitle": "Sound",
		"content.model.output.sound.descriptionTitle": "Playback of sound",
		"content.model.output.sound.descriptionBody": "Here you can choose which sound you output micro:bit plays when the model makes a prediction. Be aware that the sound plays from your computer if you have a micro:bit version 1.",
		
		"content.model.output.pin.iconTitle": "Pin",
		"content.model.output.pin.descriptionTitle": "Pin outputs",
		"content.model.output.pin.descriptionBody": "Here you can select which pin will turn on when a gesture is predicted. Each pins are numbered according to micro:bit's official pin output diagram.",

		"content.model.output.popup.header": "Connect output micro:bit",
		"content.model.output.popup.body": "If you have not connected an output micro:bit, you cannot see the results of the changed made on this page. Use the connect button below",

		// FOOTER:
		"footer.connectButtonNotConnected": "Connect your micro:bit",
		"footer.disconnectButton": "Disconnect",
		"footer.helpHeader": "Live graph",
		"footer.helpContent": "Once you have connected a micro:bit you can watch the accelerometer data for all three axes on this graph in real time. Try moving your connected micro:bit to see what the data looks like to your computer!",
		"footer.reconnecting":"Reconnecting. Please wait",
		//DATA MENU:
		"menu.data.helpHeading": "Data",
		"menu.data.helpBody": "In order to train a model to recognize different movements, we need good examples of 'good behavior' that we can show the Trainer. Here you can create classes (types of gestures) and record examples for each class. There must be at least 2 classes with 3 examples each before the trainer can train a model.",
		"menu.data.examples": "examples",
		// TRAINER MENU:
		"menu.trainer.helpHeading": "Trainer",
		"menu.trainer.helpBody": "The Trainer looks at the examples in each of the classes and tries to 'learn' how the different classes can be recognized by searching for patterns in the data. Here you can train a model to recognize different gestures.", // In addition, you can configure the trainer, choose how the trainer should interpret the data and create test sets.",
		"menu.trainer.notConnected1": "You have not connected a micro:bit.",
		"menu.trainer.notConnected2": " Please do so via the button below",
		"menu.trainer.notEnoughDataHeader1": "Not Enough Data\nGo to Data page",
		"menu.trainer.notEnoughDataInfoBody": "You need at least 2 classes with 3 examples each to attempt to train a model.",
		"menu.trainer.notEnoughDataInfo": "You have not collected enough data to train a model. You need at least 2 classes with 3 examples each. Please go to the Data page to collect more data",
		"menu.trainer.trainModelButton": "Train model",
		"menu.trainer.trainNewModelButton": "Train a new model",
		"menu.trainer.TrainingFinished": "Training done",
		"menu.trainer.TrainingFinished.body": "Go to the Model-page to examine how well your model works",
		"menu.trainer.isTrainingModelButton": "Training model",
		// MODEL MENU:
		"menu.model.helpHeading": "Model",
		"menu.model.helpBody": "The model can be used in an interactive system. Here we use the trained model to predict gestures. You can connect another micro:bit and make it respond to the predicted gestures.",
		"menu.model.noModel": "No model",
		"menu.model.connectOutputButton": "Connect output micro:bit",
		"menu.model.disconnect": "Disconnect output micro:bit",
		//CONNECT MICROBIT POP UP:

		"popup.connectMB.main.bluetooth.subtitle": "Connect using Bluetooth",

		"popup.connectMB.bluetooth.heading": "Connect using Bluetooth",
		"popup.connectMB.bluetooth.cancelledConnection": "You cancelled the connection process. Try again, if you wish to proceed.",
		"popup.connectMB.bluetooth.step0": "Connect your micro:bit to a battery",
		"popup.connectMB.bluetooth.step1": "Draw the pattern as displayed on the micro:bit",
		"popup.connectMB.bluetooth.step2": "Press the 'Connect' button below.",
		"popup.connectMB.bluetooth.step3": "Select your micro:bit and press 'Connect'.",
		"popup.connectMB.bluetooth.connect": "Connect",
		"popup.connectMB.bluetooth.connecting": "Connecting...",

		"popup.disconnectedWarning.input": "Your input micro:bit lost connection, do want to try again?",
		"popup.disconnectedWarning.output": "Your output micro:bit lost connection, do want to try again?",
		"popup.disconnectedWarning.reconnectButton.input": "Reconnect input",
		"popup.disconnectedWarning.reconnectButton.output": "Reconnect output",

		// NEW CONNECTION PROMPTS - TODO: Rename, merge with above and clean up

		"connectMB.main.usbHeader": "DOWNLOAD PROGRAM TO MICRO:BIT",
		"connectMB.main.btHeader": "CONNECT YOUR MICRO:BIT USING BLUETOOTH",
		"connectMB.main.usbBody": "If you have not previously downloaded the program",
		"connectMB.main.btBody": "If you have already downloaded the program",
		"connectMB.main.connectButton": "Connect",
		"connectMB.main.installButton": "Download",

		"connectMB.output.header": "A micro:bit is already connected",

		"connectMB.usb.header": "DOWNLOAD PROGRAM TO MICRO:BIT",
		"connectMB.usb.body1": "Connect your micro:bit using a USB-cable and click 'Next'",
		"connectMB.usb.body2": "Click 'Find USB unit' and select 'BBC micro:bit CMSIS-DAP' or 'DAPLink CMSIS-DAP' from the popup that appears",
		"connectMB.usb.button1": "Next",
		"connectMB.usb.button2": "Find USB unit",
		"connectMB.usb.pleaseWait": "Please wait. Downloading program to the micro:bit",
		"connectMB.usb.done.body1": "Done - the program has been downloaded.",
		"connectMB.usb.done.body2": "You can now connect through bluetooth.",
		"connectMB.usb.done.body3": "If you have a battery for the micro:bit, you can now remove the usb-cable and use the battery instead.",
		"connectMB.usb.done.body4": "If you do not have a battery for the micro:bit, you can simply keep powering it through the usb cable.",

		"connectMB.usb.manual.header": "Transfer file to your micro:bit",
		"connectMB.usb.manual.manualDownload": "If the file did not automatically download press",
		"connectMB.usb.manual.manualDownloadLink": "here",
		"connectMB.usb.manual.done": "Done: Connect using bluetooth",

		"connectMB.usb.firmwareBroken.warning":"We detected issues with your micro:bit firmware",
		"connectMB.usb.firmwareBroken.content1":"The version of micro:bit and firmware have known issues, that prevent us from uploading the program to it.",
		"connectMB.usb.firmwareBroken.content2":"To proceed, you will have to transfer manually, or update your micro:bit's firmware.",
		"connectMB.usb.firmwareBroken.content3":"We recommend that you upgrade the firmware of your micro:bit to the latest version to fix this issue.",
		"connectMB.usb.firmwareBroken.content4":"A guide on how can be found on the ",
		"connectMB.usb.firmwareBroken.content4.website":"micro:bit foundation's website",
		"connectMB.usb.firmwareBroken.button.skip":"Skip and transfer manually",

		"connectMB.outputMB.same": "Use the same micro:bit",
		"connectMB.outputMB.different": "Connect another micro:bit",
		"connectMB.outputMB.sameButton": "Same",
		"connectMB.outputMB.otherButton": "Other",
		// COOKIE BANNER

		"cookies.banner.title": "Cookie policy",
		"cookies.banner.subtitle": "Performance & analytics",
		"cookies.banner.text.pleaseHelp": "Please help us make it better by keeping the cookies enabled.",
		"cookies.banner.text.description": "Here at ML-Machine we use cookies to collect information on the usage and performance of the website. Without these cookies, we will not be able to collect vital information on the performance of the site.",
		"cookies.banner.text.readMore": "You can read more about it ",
		"cookies.banner.text.readMore.here": "here",
		"cookies.banner.buttons.reject": "Reject",
		"cookies.banner.buttons.accept": "Accept",

		"cookies.overlay.title": "Cookie policy",

		"cookies.overlay.question.whatAreCookies": "What are cookies?",
		"cookies.overlay.question.ourReasoning": "What do we use cookies for?",
		"cookies.overlay.question.storageDuration": "For how long are cookies stored?",
		"cookies.overlay.question.deleting": "How do i delete cookies?",
		"cookies.overlay.question.consentChange": "How do i change my consent?",

		"cookies.overlay.answer.whatAreCookies": "Cookies are small data files stored on the device you are using to browse websites. They are not programs, that contain harmful malware or viruses.",
		"cookies.overlay.answer.ourReasoning": "We use cookies to collect information on the usage and performance of the website. Without these cookies, we will not be able to collect vital information on the performance of the site.",
		"cookies.overlay.answer.storageDuration": "It varies from site to site and the usage of the cookie. Some may be stored for only the current session, while others may be stored for days. Our cookies are stored for one year.",
		"cookies.overlay.answer.deleting": "It varies from browser to browser. However here are some of the manuals for some of the most commonly used browsers.",
		"cookies.overlay.answer.consentChange": "Currently, you have not rejected nor agreed to our cookie policy. But once you do, you will be able to delete cookies to change your consent at any time.",

		"cookies.overlay.table.title": "The cookies we use",
		"cookies.overlay.table.header.description": "Description",

		"cookies.overlay.table.row.ai_user.description": "Used by Microsoft Application Insights software to collect statistical usage and telemetry information. The cookie stores a unique identifier to recognise users on returning visits over time.",
		"cookies.overlay.table.row.ai_session.description": "Preserves users states across page requests.",
		"cookies.overlay.table.row.cookie_consent.description": "Stores the terms to which you have given consent to in regards to our cookie policy.",

		// COMPATIBILITY WARNING
		"popup.compatibility.bluetooth.header": "Bluetooth incompatible browser!",
		"popup.compatibility.bluetooth.explain": "The browser you are currently using does not support bluetooth.",
		"popup.compatibility.bluetooth.advice": "Please update the browser or use another one from our supported browsers list below.",

		"popup.connectMB.USBCompatibility.transferStep.step1": "Open the location to which the firmware was downloaded. Most commonly found in your download folder.",
		"popup.connectMB.USBCompatibility.transferStep.step2": "Drag the file onto the micro:bit on your computer's file explorer.",
		"popup.connectMB.USBCompatibility.transferStep.step3": "Once the file has finished transferring, the micro:bit can be connected using Bluetooth.",

		"compatibility.platform.notSupported": "The tool is not supported on your current platform.",
		"compatibility.platform.notSupported.joinDesktop": "Join us on desktop.",
		"compatibility.webgl.notSupported": "WebGL not available. Enable WebGL to see 3D data view.",

		// CONNECTION LOST DIALOG

		"dialog.connection.lost.header": "Connection offline",
		"dialog.connection.lost.body": "Your internet connection is offline, some features may not work properly"
	}
};
  