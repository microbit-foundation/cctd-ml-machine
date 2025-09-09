// (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors

import type { MakeCodeProject } from '@microbit/makecode-embed';

export const project: MakeCodeProject = {
  text: {
    'README.md': ``,

    'main.blocks': `
<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="5rH[22#dxH5~IM6x%PE+">timer</variable>
    <variable id="gKD%iDyA}x49oH=]E{@O">item</variable>
  </variables>
  <block type="device_button_event" x="0" y="0">
    <field name="NAME">Button.A</field>
    <statement name="HANDLER">
      <block type="variables_set">
        <field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field>
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <next>
          <block type="device_while">
            <value name="COND">
              <shadow type="logic_boolean">
                <field name="BOOL">TRUE</field>
              </shadow>
              <block type="logic_compare">
                <field name="OP">GT</field>
                <value name="A">
                  <shadow type="math_number">
                    <field name="NUM">0</field>
                  </shadow>
                  <block type="variables_get">
                    <field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field>
                  </block>
                </value>
                <value name="B">
                  <shadow type="math_number">
                    <field name="NUM">0</field>
                  </shadow>
                </value>
              </block>
            </value>
            <statement name="DO">
              <block type="automationbit_set_output">
                <field name="output">automationbit.Output.Two</field>
                <value name="state">
                  <shadow type="math_number_minmax">
                    <mutation min="0" max="1" label="State" precision="0"/>
                    <field name="SLIDER">1</field>
                  </shadow>
                </value>
                <next>
                  <block type="automationbit_set_output">
                    <field name="output">automationbit.Output.One</field>
                    <value name="state">
                      <shadow type="math_number_minmax">
                        <mutation min="0" max="1" label="State" precision="0"/>
                        <field name="SLIDER">1</field>
                      </shadow>
                    </value>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="variables_set">
                <field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field>
                <value name="VALUE">
                  <shadow type="math_number">
                    <field name="NUM">2</field>
                  </shadow>
                </value>
                <next>
                  <block type="device_while">
                    <value name="COND">
                      <shadow type="logic_boolean">
                        <field name="BOOL">TRUE</field>
                      </shadow>
                      <block type="logic_compare">
                        <field name="OP">GT</field>
                        <value name="A">
                          <shadow type="math_number">
                            <field name="NUM">0</field>
                          </shadow>
                          <block type="variables_get">
                            <field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field>
                          </block>
                        </value>
                        <value name="B">
                          <shadow type="math_number">
                            <field name="NUM">0</field>
                          </shadow>
                        </value>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="automationbit_set_output">
                        <field name="output">automationbit.Output.One</field>
                        <value name="state">
                          <shadow type="math_number_minmax">
                            <mutation min="0" max="1" label="State" precision="0"/>
                            <field name="SLIDER">1</field>
                          </shadow>
                        </value>
                        <next>
                          <block type="automationbit_set_output">
                            <field name="output">automationbit.Output.Two</field>
                            <value name="state">
                              <shadow type="math_number_minmax">
                                <mutation min="0" max="1" label="State" precision="0"/>
                                <field name="SLIDER">0</field>
                              </shadow>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="device_forever" x="358" y="1">
    <statement name="HANDLER">
      <block type="device_pause">
        <value name="pause">
          <shadow type="timePicker">
            <field name="ms">1000</field>
          </shadow>
        </value>
        <next>
          <block type="variables_change">
            <field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field>
            <value name="VALUE">
              <shadow type="math_number">
                <field name="NUM">-1</field>
              </shadow>
            </value>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="device_button_event" x="359" y="208">
    <field name="NAME">Button.B</field>
    <statement name="HANDLER">
      <block type="automationbit_set_output">
        <field name="output">automationbit.Output.One</field>
        <value name="state">
          <shadow type="math_number_minmax">
            <mutation min="0" max="1" label="State" precision="0"/>
            <field name="SLIDER">0</field>
          </shadow>
        </value>
        <next>
          <block type="automationbit_set_output">
            <field name="output">automationbit.Output.Two</field>
            <value name="state">
              <shadow type="math_number_minmax">
                <mutation min="0" max="1" label="State" precision="0"/>
                <field name="SLIDER">0</field>
              </shadow>
            </value>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>
`,

    'main.ts': `
let timer = 0

input.onButtonPressed(Button.B, function () {
    automationbit.setOutput(automationbit.Output.One, 0)
    automationbit.setOutput(automationbit.Output.Two, 0)
})

input.onButtonPressed(Button.A, function () {
    timer = 10
    while (timer > 0) {
        automationbit.setOutput(automationbit.Output.Two, 1)
        automationbit.setOutput(automationbit.Output.One, 1)
    }
    timer = 2
    while (timer > 0) {
        automationbit.setOutput(automationbit.Output.One, 1)
        automationbit.setOutput(automationbit.Output.Two, 0)
    }
})

basic.forever(function () {
    basic.pause(1000)
    timer += -1
})
`,

    'pxt.json': `
{
  "name": "OilSpillCleanerUpper",
  "description": "",
  "dependencies": {
    "core": "*",
    "radio": "*",
    "automationbit": "github:pimoroni/pxt-automationbit#v0.0.2"
  },
  "files": [
    "main.blocks",
    "main.ts",
    "README.md"
  ],
  "targetVersions": {
    "branch": "v1.2.13",
    "tag": "v1.2.13",
    "commits": "https://github.com/Microsoft/pxt-microbit/commits/5d5b348757b15c6d00f5b7f560fd69592ca29424",
    "target": "1.2.13",
    "pxt": "4.4.7"
  },
  "preferredEditor": "blocksprj"
}
`,
  },
};
