<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { t } from '../../i18n';

  const cookies = [
    {
      name: 'ai_user',
      description: $t('cookies.overlay.table.row.ai_user.description'),
    },
    {
      name: 'ai_session',
      description: $t('cookies.overlay.table.row.ai_session.description'),
    },
    {
      name: 'cookie_consent',
      description: $t('cookies.overlay.table.row.cookie_consent.description'),
    },
  ];

  const cookieDeleteManuals = [
    {
      browser: 'Internet Explorer',
      link: 'https://support.microsoft.com/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d#ie=ie-11',
    },
    {
      browser: 'Microsoft Edge',
      link: 'https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09',
    },
    {
      browser: 'Mozilla FireFox',
      link: 'https://support.mozilla.org/kb/delete-cookies-remove-info-websites-stored',
    },
    {
      browser: 'Google Chrome',
      link: 'https://support.google.com/chrome/answer/95647',
    },
    {
      browser: 'Opera',
      link: 'https://help.opera.com/latest/web-preferences/#cookies',
    },
    {
      browser: 'Safari',
      link: 'https://support.apple.com/guide/safari/sfri11471/mac',
    },
    {
      browser: 'Apple Devices',
      link: 'https://support.apple.com/HT201265',
    },
    {
      browser: 'Chrome for android',
      link: 'https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid',
    },
  ];
</script>

<div
  class="justify-center items-center content-center w-150 h-150 bg-white m-auto"
  transition:slide>
  <!-- CLOSE ICON -->
  <div class="w-150 h-150 p-3">
    <div>
      <p class="text-red-500 font-bold text-center text-xl">
        {$t('cookies.overlay.title')}
      </p>
    </div>
    <div class="overflow-y-scroll h-10/11">
      <div class="p-2">
        <p class="font-bold">{$t('cookies.overlay.question.whatAreCookies')}</p>
        <p>{$t('cookies.overlay.answer.whatAreCookies')}</p>
        <p class="font-bold mt-2">{$t('cookies.overlay.question.ourReasoning')}</p>
        <p>{$t('cookies.overlay.answer.ourReasoning')}</p>
        <p class="font-bold mt-2">
          {$t('cookies.overlay.question.storageDuration')}
        </p>
        <p>
          {$t('cookies.overlay.answer.storageDuration')}
        </p>
        <p class="font-bold mt-2">
          {$t('cookies.overlay.question.deleting')}
        </p>
        <p>
          {$t('cookies.overlay.answer.deleting')}
        </p>
        <ul>
          {#each cookieDeleteManuals as manual}
            <li>
              <a class="text-blue-400" href={manual.link} target="_blank"
                >{manual.browser}</a>
            </li>
          {/each}
        </ul>
        <p class="font-bold mt-2">
          {$t('cookies.overlay.question.consentChange')}
        </p>
        <p>
          {$t('cookies.overlay.answer.consentChange')}
        </p>
      </div>
      <div>
        <p class="font-bold text-lg ml-2 mt-2">{$t('cookies.overlay.table.title')}</p>
        <div class="flex">
          <div class="table ml-2 mr-4">
            <div class="table-row">
              <div class="table-cell bg-gray-200 justify-center align-middle">
                <p class="m-2 font-bold">Cookie</p>
              </div>
              <div class="table-cell bg-gray-100">
                <p class="m-2 text-center font-bold">
                  {$t('cookies.overlay.table.header.description')}
                </p>
              </div>
            </div>
            {#each cookies as cookie}
              <hr />
              <div class="table-row">
                <div class="table-cell bg-gray-200/50 justify-center align-middle">
                  <p class="m-2">{cookie.name}</p>
                </div>
                <div class="table-cell bg-gray-100/50">
                  <p class="m-2">{cookie.description}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
