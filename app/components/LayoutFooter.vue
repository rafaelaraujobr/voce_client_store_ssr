<template>
  <div class="bg-dark text-white q-py-md">
    <div class="wrapper">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="bg-transparent">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-sm">Contato</div>
              <div class="text-subtitle2">
                <div>Email: contato@flashapp.com</div>
                <div>central: (11) 99999-9999</div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat class="bg-transparent">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-sm">
                Termos de uso
              </div>
              <div class="text-subtitle2 column q-gutter-xs">
                <router-link to="/privacy-policy" class="link-decoration-none text-white">
                  Política de privacidade
                </router-link>
                <router-link to="/terms-of-use" class="link-decoration-none text-white">
                  Termos de uso
                </router-link>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="bg-transparent">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-sm">
                Principais dúvidas
              </div>
              <div class="text-subtitle2 column q-gutter-xs">
                <router-link to="/privacy-policy" class="link-decoration-none text-white">
                  Troca e devolução
                </router-link>
                <router-link to="/terms-of-use" class="link-decoration-none text-white">
                  Black Friday
                </router-link>
                <router-link to="/terms-of-use" class="link-decoration-none text-white">
                  Sobre a entrega
                </router-link>
                <router-link to="/terms-of-use" class="link-decoration-none text-white">
                  Quantidade de parcelas
                </router-link>
                <router-link to="/terms-of-use" class="link-decoration-none text-white">
                  Como fazer uma compra
                </router-link>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="bg-transparent">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-sm">
                Redes sociais
              </div>
              <div class="text-subtitle2 row q-gutter-sm">
                <a v-for="(social, index) in channels" :key="index" :href="social?.link" target="_blank"
                  class="link-decoration-none text-white">
                  <q-icon :name="getSocialIcon(social.type)" size="24px" />
                </a>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-separator dark class="q-my-md" />
      <div class="row">
        <div class="col-12 col-md-6">
          <q-card flat class="bg-transparent">
            <q-card-section>
              <div class="text-body2 text-weight-medium q-mb-sm">
                Vendido e entregue por:
              </div>
              <div class="row q-gutter-sm items-center">
                <div v-for="campaign in campaigns" :key="campaign.id">
                  <q-img :src="campaign?.logotipo" fit="contain" :width="$q.screen.lt.md ? '80px' : '100px'"
                    :height="$q.screen.lt.md ? '40px' : '50px'" class="img-campaign-footer" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
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
    filter: grayscale(100%);
    opacity: 1;
</style>
