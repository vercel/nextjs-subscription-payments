const robotIcon = './smart_toy_white_24dp.svg';
const vSettingsIcon = './video_settings_white_24dp.svg';
const logoutIcon = './logout_black_24dp.svg';
const listIcon = './format_list_bulleted_white_24dp.svg';
const infoIcon = './help_outline_white_24dp.svg';
const gearIcon = './settings_white_24dp.svg';
const gridIcon = './dashboard_white_24dp.svg';
const accountsIcon = './manage_accounts_white_24dp.svg';

const navLinks = [{
        id: 'dashboard',
        title: 'DASHBOARD',
        icon: gridIcon,
        path: '/hb',
    },
    {
        id: 'lists',
        title: 'MY LISTS',
        icon: listIcon,
        path: '/hb/mylists',
    },
    {
        id: 'accounts',
        title: 'MY ACCOUNTS',
        icon: accountsIcon,
        path: '/hb/myaccounts',
    },
    {
        id: 'vsettings',
        title: 'VIDEO SETTINGS',
        icon: vSettingsIcon,
        path: '/hb/videoconfigs',
    },
    {
        id: 'bsettings',
        title: 'BOT SETTINGS',
        icon: robotIcon,
        path: '/hb/botconfigs',
    },
    {
        id: 'infos',
        title: 'INFOS',
        icon: infoIcon,
        path: '/hb/help',
    },
];

const bottomSideLinks = [{
        id: 'gsettings',
        title: 'GENERAL SETTINGS',
        icon: gearIcon,
        path: '/hb/gsettings',
    },
    {
        id: 'logout',
        title: 'LOGOUT',
        icon: logoutIcon,
        path: '/hb/logout',
    },

];

export { navLinks, bottomSideLinks };