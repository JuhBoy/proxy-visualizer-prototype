import { SettingRow, Input, Select, CheckBox } from "./Renderer/Settings/SettingRow";
import { HashStr } from "./Utils/Collections";
import { Chip } from "./Renderer/Settings/Chip";
import { appendCss, chipContainerCss } from "./Utils/CssHelpers";
import { createNormalButton } from "./Utils/DomHelper";
import { getState, updateState, syncState } from "./Utils/MenuHelpers";
import { SettingStateSyncChannel, GlobalIpcMessage } from "./Utils/IPCChannels";
import { ipcRenderer } from "electron";
import { IEventMessage } from "./Models/IEventMessage";

export function Init() {
    let init = false;
    let { port, pInterface, proxyRegistration, exclusionList } = reload();

    const wrapper = document.querySelector("#main-wrapper") as HTMLElement;

    let portInput: Input = buildPort(wrapper);
    let interfaceInput: Select = buildInterface(wrapper);
    let registrationCheckbox: CheckBox = buildProxyRegistration(wrapper);
    buildExclusionList(wrapper);
    buildSaveButton(wrapper);

    let ipcListener = (_: any, message: IEventMessage) => {
        if (!init) return;

        let updater: any = reload();
        port = updater.port, pInterface = updater.pInterface, proxyRegistration = updater.proxyRegistration, exclusionList = updater.exclusionList;

        portInput.setValue(port);
        interfaceInput.setValue(pInterface);
        registrationCheckbox.setValue(proxyRegistration);

        document.querySelector('#chips-container').innerHTML = null;
        (exclusionList as string[]).forEach(el => {
            buildChip(el, false);
        });
    }
    ipcRenderer.removeListener(GlobalIpcMessage, ipcListener);
    ipcRenderer.on(GlobalIpcMessage, ipcListener);
    init = true;

    function reload(): any {
        const newState = getState();
        return {
            state: newState,
            port: newState.settings.port,
            pInterface: newState.settings.interface,
            proxyRegistration: newState.settings.registered,
            exclusionList: newState.settings.exclusionList,
        }
    }

    function buildPort(wrapper: HTMLElement): Input {
        const portInput = new Input("Listening Port", null);
        portInput.setValue(port);
        portInput.setIcon('fas fa-network-wired')
        portInput.setTypeName('number', 'port-number');
        portInput.setListener('focusout', (ev) => {
            port = +(ev.target as any).value;
        });

        const portRow = new SettingRow(null, wrapper);
        portRow.addContent(portInput);
        portRow.flush();

        return portInput;
    }

    function buildInterface(wrapper: HTMLElement): Select {
        const selector = new Select("Listening interface", null);
        const hash: HashStr<string> = { 'Select a listening interface': '0', 'All': '1', 'Loopback': '2' };
        selector.addOptions(hash);
        selector.setValue(pInterface);
        selector.addListener((ev) => {
            const target: any = ev.target;
            pInterface = target.options[target.selectedIndex].value;
        });

        const selectorRow = new SettingRow(null, wrapper);
        selectorRow.addContent(selector);
        selectorRow.flush();

        return selector;
    }

    function buildProxyRegistration(wrapper: HTMLElement): CheckBox {
        const row = new SettingRow(null, wrapper);

        const checkbox = new CheckBox("Proxy System Registration", row.getInnerRow());
        checkbox.addListener((ev) => {
            const target: any = ev.currentTarget;
            proxyRegistration = target.checked;
        });
        checkbox.setValue(proxyRegistration);
        checkbox.flush();
        row.flush();

        return checkbox;
    }

    function buildSaveButton(wrapper: HTMLElement) {
        const button = createNormalButton('Save', '') as HTMLElement;
        appendCss(button, { float: 'right' });

        const row = new SettingRow(null, wrapper);
        row.getInnerRow().appendChild(button);
        row.flush();

        button.addEventListener('click', (ev) => {
            const { remote } = require("electron");
            updateState({
                settings: {
                    port: port,
                    inteface: pInterface,
                    registration: proxyRegistration,
                    exclusionList: exclusionList
                }
            });
            syncState(SettingStateSyncChannel);
            //remote.getCurrentWindow().hide();
        });
    }

    function buildExclusionList(wrapper: HTMLElement) {
        const input = new Input("Host Exclusion List", null);
        input.setIcon('fas fa-link');
        input.setTypeName('text', 'exclusion-list');
        input.setListener('keyup', function(ev: any) {
            if (ev.keyCode == 13 && ev.currentTarget.value) {
                buildChip(ev.currentTarget.value, true);
                ev.currentTarget.value = null;
            }
        });

        const row = new SettingRow(null, wrapper);
        row.addContent(input);
        row.flush();

        const chipRow = new SettingRow(null, wrapper);
        chipRow.setCustomAttributes({ id: 'chips-container', class: 'row' });
        appendCss(chipRow.getDomElement(), chipContainerCss);
        chipRow.flush();

        exclusionList.forEach(function(e: string) {
            buildChip(e, false);
        });
    }

    function buildChip(value: string, addToList: boolean) {
        const parent = document.querySelector('#chips-container') as HTMLElement;

        const chip = new Chip(value, parent);
        chip.addRightIcon('fas fa-times pointer chip-delete', function(ev) {
            const i = exclusionList.indexOf(this.parentNode.innerText);
            exclusionList.splice(i, 1);

            parent.removeChild(this.parentNode);
        });
        chip.flush();

        if (addToList) {
            exclusionList.push(value);
        }
    }
}
