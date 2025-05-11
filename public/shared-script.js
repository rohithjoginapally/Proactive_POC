// Shared Kore.ai bot initialization
var chatConfig = KoreChatSDK.chatConfig;
var chatWindow = KoreChatSDK.chatWindow;
var chatWindowInstance = new chatWindow();
var BrowserTTSPlugin = BrowserTTSPluginSDK.BrowserTTS;
var Korei18nPlugin = Korei18nPluginSDK.Korei18nPlugin;
var WebKitSTTPlugin = WebKitSTTPluginSDK.WebKitSTT;
chatWindowInstance.installPlugin(new Korei18nPlugin());

var botOptions = chatConfig.botOptions;
botOptions.koreAPIUrl = "https://platform.kore.ai/api/";
botOptions.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
botOptions.userIdentity = "shivaniv@pronixinc.com";
botOptions.botInfo = { name: "Proactive_POC_2", _id: "st-6bd452b8-0f7c-5a50-9135-963008a8e7e1"};
botOptions.clientId = "cs-55a7f855-91b0-5067-99e3-773e09e95413";
botOptions.clientSecret = "K/k/qE9hBgMwOe4AyoA21tTUGVjAPbiDQj7crKpHWwY=";
//botOptions.brandingAPIUrl = botOptions.koreAPIUrl + 'websdkthemes/' + botOptions.botInfo._id + '/activetheme';
botOptions.enableThemes = true;
KoreChatSDK.chatConfig.botOptions.API_KEY_CONFIG.KEY = "565226cd23864a19a3184ce13ec9d1954a83c1f38d404241824f77c709dc4e3bst6b";
KoreChatSDK.chatConfig.botOptions.openSocket = true;   // Web‑socket kept open
KoreChatSDK.chatConfig.pwcConfig = { enable: true };  // enable PWC engine
// var AgentDeskTopPlugin = AgentDeskTopPluginSDK.AgentDesktopPlugin;
// chatWindowInstance.installPlugin(new AgentDesktopPlugin());
// var ProactiveWebCampaignPlugin =
// ProactiveWebCampaignPluginSDK.ProactiveWebCampaignPlugin;
// chatWindowInstance.installPlugin(
//         new ProactiveWebCampaignPlugin({ dependentPlugins: { AgentDesktopPlugin: true }})
//   );

const AgentDesktopPlugin =
        (window.AgentDeskTopPluginSDK &&          // v11.11.x  (DeskTop‑case!)
         window.AgentDeskTopPluginSDK.AgentDesktopPlugin)
     || window.AgentDeskTopPlugin;                // fallback for future builds

/* ---- Safety check ------------------------------------------------------- */
if (typeof AgentDesktopPlugin !== 'function') {
  console.error('Agent‑Desktop plugin still missing – check filename / load order');
} else {
  chatWindowInstance.installPlugin(new AgentDesktopPlugin());
}

/* Proactive Web Campaign depends on Agent‑Desktop */
const ProactiveWebCampaignPlugin =
        window.ProactiveWebCampaignPlugin ??
        (window.ProactiveWebCampaignPluginSDK &&
         window.ProactiveWebCampaignPluginSDK.ProactiveWebCampaignPlugin);

if (ProactiveWebCampaignPlugin) {
  console.log(window.ProactiveWebCampaignPlugin);
  chatWindowInstance.installPlugin(
      new ProactiveWebCampaignPlugin({ dependentPlugins: { AgentDesktopPlugin: true }})
  );
}

KoreChatSDK.chatConfig.botOptions.botInfo.customData = { language: "french" };
chatConfig.i18n = { defaultLanguage: "fr" };
chatWindowInstance.plugins.Korei18nPlugin.config = { availableLanguages: ['fr'], defaultLanguage:'fr', languageStrings:{ fr: { message:'Message...' }}};
chatConfig.branding.chat_bubble.style = "rounded";
chatWindowInstance.show(KoreChatSDK.chatConfig);