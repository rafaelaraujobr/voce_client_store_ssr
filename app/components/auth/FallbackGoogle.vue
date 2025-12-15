<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAccountComposable } from '~/composables/account.composable';

const { getProfile, setOpenSignIn, setToken, setRefreshToken } = useAccountComposable()

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const access_token = route.query.access_token;
    const refresh_token = route.query.refresh_token;

    if (!access_token || !refresh_token) {
        Notify.create({
          message: 'Erro ao fazer login com o Google',
          color: 'warning',
          position: 'bottom',
          icon: 'report_problem'
        });
        return;
    }

    setToken(access_token)
    setRefreshToken(refresh_token)
    await getProfile()
    setOpenSignIn(false)

    router.push({ name: 'Home' })

});
</script>