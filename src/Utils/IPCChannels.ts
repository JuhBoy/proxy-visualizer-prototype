
/**
 * Channel triggerd when a module require the state
 */
export const GlobalRequireStateChannel: string = 'require-state';

/**
 * Channel triggered when IPC from main To Renderer process
 * Usually update state for the renderer process.
 * @param IEventMessage must be used as data type on send/sendSync electron ipc requests.
 */
export const GlobalIpcMessage: string = 'serve-ipc-message';

/**
 * Channel triggered when user click on exchange list item.
 */
export const ExchangeClickChannel: string = 'http-exchange-click';

/**
 * Channel triggered when a menu item is clicked
 */
export const MenuActionChannel: string = 'menu-action';

/**
 * Channel triggered when a new http exchange must be added to the UI list
 */
export const NewHttpExchangePushChannel: string = 'http-exchange-push';

/**
 * Channel triggered when a batch of exchanges must be added to the UI List
 */
export const BatchHttpExchangePushChannel: string = 'http-exchange-batch-push';

/**
 * Channel triggered when selected content must be updated
 */
export const UpdateExchangeContentChannel: string = 'update-exchange-content';

/**
 * Channel triggered when settings must update the application state
 */
export const SettingStateSyncChannel: string = 'renderer-settings-state-sync';
