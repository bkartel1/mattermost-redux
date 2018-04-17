// Copyright (c) 2018-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.
// @flow

import {getAllChannels} from 'selectors/entities/channels';
import {getTeams} from 'selectors/entities/teams';
import {ScopeTypes} from 'constants/schemes';
import type {GlobalState} from 'types/store';
import type {Scheme} from 'types/schemes';
import type {Channel} from 'types/channels';
import type {Team} from 'types/teams';

export function getSchemes(state: GlobalState): { [string]: Scheme } {
    return state.entities.schemes.schemes;
}

export function getScheme(state: GlobalState, id: string): Scheme {
    const schemes = getSchemes(state);
    return schemes[id];
}

export function getSchemeChannels(state: GlobalState, schemeId: string): Array<Channel> {
    const {scope} = getScheme(state, schemeId);

    if (scope === ScopeTypes.TEAM) {
        const msg = `Not implemented: scheme '${schemeId}' is team-scope but 'getSchemeChannels' only accepts channel-scoped schemes.`;
        console.warn(msg); // eslint-disable-line no-console
        return [];
    }

    const schemeChannels: Array<Channel> = [];

    Object.entries(getAllChannels(state)).forEach((item: [string, Channel]) => {
        const [, channel: Channel] = item;
        if (channel.scheme_id === schemeId) {
            schemeChannels.push(channel);
        }
    });

    return schemeChannels;
}

export function getSchemeTeams(state: GlobalState, schemeId: string): Array<Team> {
    const {scope} = getScheme(state, schemeId);

    if (scope === ScopeTypes.CHANNEL) {
        const msg = `Error: scheme '${schemeId}' is channel-scoped but 'getSchemeChannels' only accepts team-scoped schemes.`;
        console.warn(msg); // eslint-disable-line no-console
        return [];
    }

    const schemeTeams: Array<Team> = [];

    Object.entries(getTeams(state)).forEach((item: [string, Team]) => {
        const [, team: Team] = item;
        if (team.scheme_id === schemeId) {
            schemeTeams.push(team);
        }
    });

    return schemeTeams;
}