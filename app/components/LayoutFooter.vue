<template>
  <div class="bg-dark text-white q-py-md">
    <div class="wrapper">
      <!-- Mobile Layout -->
      <template v-if="isMobile">
        <div class="column q-gutter-y-sm q-px-md">
          <!-- Redes Sociais (primeiro no mobile) -->
          <div class="text-center q-py-sm">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              {{ $t("socialNetworks") }}
            </div>
            <div class="row justify-center q-gutter-sm">
              <a
                v-for="(social, index) in channels"
                :key="index"
                :href="social?.link"
                target="_blank"
                class="social-icon-mobile"
              >
                <q-icon :name="getSocialIcon(social.type)" size="28px" />
              </a>
            </div>
          </div>

          <q-separator dark />

          <!-- Seções colapsáveis -->
          <q-expansion-item
            dense
            header-class="text-white"
            expand-icon-class="text-white"
          >
            <template #header>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  {{ $t("contact") }}
                </q-item-label>
              </q-item-section>
            </template>
            <div class="q-pl-md q-pb-sm text-grey-5 text-body2">
              <div>{{ $t("email") }}: contato@flashapp.com</div>
              <div>{{ $t("phone") }}: (11) 99999-9999</div>
            </div>
          </q-expansion-item>

          <q-expansion-item
            dense
            header-class="text-white"
            expand-icon-class="text-white"
          >
            <template #header>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  {{ $t("termsOfUse") }}
                </q-item-label>
              </q-item-section>
            </template>
            <div class="q-pl-md q-pb-sm column q-gutter-y-xs">
              <router-link to="/privacy-policy" class="footer-link-mobile">
                {{ $t("privacyPolicy") }}
              </router-link>
              <router-link to="/terms-of-use" class="footer-link-mobile">
                {{ $t("termsOfUse") }}
              </router-link>
            </div>
          </q-expansion-item>

          <q-expansion-item
            dense
            header-class="text-white"
            expand-icon-class="text-white"
          >
            <template #header>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  {{ $t("mainQuestions") }}
                </q-item-label>
              </q-item-section>
            </template>
            <div class="q-pl-md q-pb-sm column q-gutter-y-xs">
              <router-link to="/privacy-policy" class="footer-link-mobile">
                {{ $t("exchangeAndReturn") }}
              </router-link>
              <router-link to="/terms-of-use" class="footer-link-mobile">
                {{ $t("blackFriday") }}
              </router-link>
              <router-link to="/terms-of-use" class="footer-link-mobile">
                {{ $t("aboutDelivery") }}
              </router-link>
              <router-link to="/terms-of-use" class="footer-link-mobile">
                {{ $t("quantityOfInstallments") }}
              </router-link>
              <router-link to="/terms-of-use" class="footer-link-mobile">
                {{ $t("howToMakeAPurchase") }}
              </router-link>
            </div>
          </q-expansion-item>

          <q-separator dark />

          <!-- Campanhas -->
          <div class="text-center q-py-sm">
            <div class="text-caption text-grey-5 q-mb-sm">
              {{ $t("soldAndDeliveredBy") }}
            </div>
            <div class="row justify-center q-gutter-sm">
              <q-img
                v-for="campaign in campaigns"
                :key="campaign.id"
                :src="campaign?.logotipo"
                fit="contain"
                width="60px"
                class="img-campaign-footer"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Desktop Layout -->
      <template v-else>
        <div class="row">
          <div class="col-3">
            <q-card flat class="bg-transparent">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">
                  {{ $t("contact") }}
                </div>
                <div class="text-subtitle2">
                  <div>{{ $t("email") }}: contato@flashapp.com</div>
                  <div>{{ $t("phone") }}: (11) 99999-9999</div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat class="bg-transparent">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">
                  {{ $t("termsOfUse") }}
                </div>
                <div class="text-subtitle2 flex gap-1">
                  <router-link to="/privacy-policy" class="link-decoration-none">
                    {{ $t("privacyPolicy") }}
                  </router-link>
                  <router-link to="/terms-of-use" class="link-decoration-none">
                    {{ $t("termsOfUse") }}
                  </router-link>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card flat class="bg-transparent">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">
                  {{ $t("mainQuestions") }}
                </div>
                <div class="text-subtitle2 flex gap-1">
                  <router-link to="/privacy-policy" class="link-decoration-none">
                    {{ $t("exchangeAndReturn") }}
                  </router-link>
                  <router-link to="/terms-of-use" class="link-decoration-none">
                    {{ $t("blackFriday") }}
                  </router-link>
                  <router-link to="/terms-of-use" class="link-decoration-none">
                    {{ $t("aboutDelivery") }}
                  </router-link>
                  <router-link to="/terms-of-use" class="link-decoration-none">
                    {{ $t("quantityOfInstallments") }}
                  </router-link>
                  <router-link to="/terms-of-use" class="link-decoration-none">
                    {{ $t("howToMakeAPurchase") }}
                  </router-link>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card flat class="bg-transparent">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">
                  {{ $t("socialNetworks") }}
                </div>
                <div class="text-subtitle2">
                  <router-link
                    v-for="(social, index) in channels"
                    :key="index"
                    :to="social?.link"
                    target="_blank"
                    class="link-decoration-none"
                  >
                    <q-icon :name="getSocialIcon(social.type)" size="24px" />
                  </router-link>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-separator dark />
        <div class="row">
          <div class="col-4">
            <q-card flat class="bg-transparent">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">
                  {{ $t("soldAndDeliveredBy") }}:
                </div>
                <q-tabs
                  v-model="tab"
                  inline-label
                  active-color="transparent"
                  dense
                  justify="left"
                >
                  <q-tab
                    v-for="campaign in campaigns"
                    :key="campaign.id"
                    :name="campaign.name"
                    dense
                    class="q-py-none"
                  >
                    <q-img
                      :src="campaign?.logotipo"
                      fit="contain"
                      width="80px"
                      class="img-campaign-footer"
                    />
                  </q-tab>
                </q-tabs>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import type { Campaign, Channel } from "~/types/shop.types";
const { shop } = useShop();
const channels = computed<Channel[]>(() => {
  if (shop?.value && shop?.value?.channels)
    return shop?.value?.channels as Channel[];
  return [] as Channel[];
});
const campaigns = computed<Campaign[]>(() => {
  if (shop?.value && shop?.value?.campaigns)
    return shop?.value?.campaigns as Campaign[];
  return [] as Campaign[];
});
const tab = ref<string>("mails");

const isMobile = computed(() => {
  return useQuasar().screen.lt.sm;
});

function getSocialIcon(social: string) {
  switch (social) {
    case "facebook":
      return "fa-brands fa-facebook";
    case "instagram":
      return "fa-brands fa-instagram";
    case "twitter":
      return "fa-solid fa-twitter";
    case "youtube":
      return "fa-brands fa-youtube";
    case "linkedin":
      return "fa-brands fa-linkedin";
    case "tiktok":
      return "fa-brands fa-tiktok";
    case "pinterest":
      return "fa-brands fa-pinterest";
    case "reddit":
      return "fa-brands fa-reddit";
    case "snapchat":
      return "fa-brands fa-snapchat";
    case "spotify":
      return "fa-brands fa-spotify";
    case "twitch":
      return "fa-brands fa-twitch";
    default:
      return "fa-brands fa-link";
  }
}
</script>
<style lang="sass">
.img-campaign-footer
  filter: grayscale(100%)
  opacity: 1

.social-icon-mobile
  display: flex
  align-items: center
  justify-content: center
  width: 44px
  height: 44px
  border-radius: 50%
  background: rgba(255, 255, 255, 0.1)
  color: white
  text-decoration: none
  transition: all 0.2s ease

  &:hover
    background: rgba(255, 255, 255, 0.2)
    transform: scale(1.1)

.footer-link-mobile
  color: #9e9e9e
  text-decoration: none
  font-size: 14px
  padding: 4px 0
  transition: color 0.2s ease

  &:hover
    color: white
</style>
