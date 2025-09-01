<template>
  <div class="row q-col-gutter-sm full-width">
    <div v-for="n in 12" :key="n" class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
      <q-card flat bordered class="product-card">
        <q-card-section
          class="row q-pa-none q-ma-none justify-center items-center"
        >
          <div class="col-4 col-md-12 bg-default">
            <q-skeleton height="118px" square />
          </div>
          <div class="col-8 col-md-12 q-py-md">
            <q-item>
              <q-item-section>
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="40%" class="q-mt-sm" />
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
