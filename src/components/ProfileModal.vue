<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Auth } from 'aws-amplify';
import { useProfileStore } from '@/stores/profile';
import { useVuelidate } from '@vuelidate/core';
import { required, email, numeric } from '@vuelidate/validators';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const router = useRouter();
const profileStore = useProfileStore();
const user = Auth.user;
const route = useRoute();

const rules = {
  name: {required},
  date_of_birth: {},
  // address: { required },
  // post_code: { required  },
  // city: { required  },
  // phone: { required, numeric },
  country: {required},
  // cardholder_name : { required },
  // bank_number: { required }
};

const v$ = useVuelidate(rules, profileStore);
const loading = ref(false);
const errors = ref({});
const profileSnapshot = ref({});
const canSave = computed(() => {
  return JSON.stringify(profileSnapshot.value) !== JSON.stringify(profileStore.$state);
});

const countries = ref([
  {
    code: 'AT',
    name: 'Austria'
  },
  {
    code: 'NL',
    name: 'Netherlands'
  },
  // {
  //   code: 'GR',
  //   name: 'Germany'
  // },
  // {
  //   code: 'UK',
  //   name: 'United Kingdom'
  // },
  // {
  //   code: 'US',
  //   name: 'United States'
  // }
]);


async function save(event) {
  event.preventDefault();

  loading.value = true;
  await profileStore.save();
  profileSnapshot.value = Object.assign({}, profileStore.$state);
  loading.value = false;
}

async function activate() {
  v$.value.$reset();
  const valid = await v$.value.$validate();
  if (valid) {
    loading.value = true;
    const data = await profileStore.activateStripeExpress();
    if (!data.url) {
      loading.value = false;
      console.log(data);
    } else if (data.type === 'login_link') {
      loading.value = false;
      window.open(data.url, '_blank');
    } else {
      window.location.href = data.url;
    }
  }
}

onBeforeMount(async () => {
  loading.value = true;
  await profileStore.fetch();
  profileSnapshot.value = Object.assign({}, profileStore.$state);
  loading.value = false;
});
</script>

<template>
  <form class="modal" @submit="save">
    <div class="modal-content">
      <header>
        <button type="button" @click="router.push({name: route.query.return || 'dashboard'})">
          <i class="material-symbols-rounded">
            arrow_back
          </i>
        </button>
        <h3>Profile</h3>

        <div class="actions">
          <button class="btn" type="submit" :disabled="!canSave">
            Save
          </button>
        </div>
      </header>

      <main>
        <section>
          <h3>
            Account
          </h3>

          <label class="field">
            <span>Username/Email</span>
            <strong>
              {{ profileStore.username }}
            </strong>
          </label>
        </section>


        <section>
          <h3>
            Personal Details
          </h3>

          <label class="field field-text">
            <span>
              Name
            </span>
            <input type="text" v-model="profileStore.name"/>
            <p class="text text-error" v-if="v$.name.$error">Name is required</p>
          </label>

          <label class="field field-text">
            <span>
              Bio
            </span>
            <textarea v-model="profileStore.bio"></textarea>
          </label>

          <!--          <div class="field field-date">-->
          <!--            <span>Date of birth</span>-->
          <!--            <vue-date-picker :model-value="profileStore.date_of_birth"-->
          <!--                             @update:model-value="date => profileStore.date_of_birth = date"-->
          <!--                             model-type="yyyy-MM-dd"-->
          <!--                             format="yyyy-MM-dd"-->
          <!--                             :enable-time-picker="false"-->
          <!--                             auto-apply-->
          <!--                             dark></vue-date-picker>-->
          <!--            <span class="text text-error" v-if="v$.date_of_birth.$error">Post code is required</span>-->
          <!--          </div>-->

          <!--          <label class="field field-text">-->
          <!--            <span>-->
          <!--              Address-->
          <!--            </span>-->
          <!--            <input type="text" v-model="profileStore.address"/>-->
          <!--            <span class="text text-error" v-if="v$.address.$error">Address is required</span>-->
          <!--          </label>-->

          <!--          <label class="field field-text">-->
          <!--              <span>-->
          <!--                Post code-->
          <!--              </span>-->
          <!--            <input type="text" v-model="profileStore.post_code"/>-->
          <!--            <span class="text text-error" v-if="v$.post_code.$error">Post code is required</span>-->
          <!--          </label>-->

          <!--          <label class="field field-text">-->
          <!--              <span>-->
          <!--                City-->
          <!--              </span>-->
          <!--            <input type="text" v-model="profileStore.city"/>-->
          <!--            <span class="text text-error" v-if="v$.city.$error">City is required</span>-->
          <!--          </label>-->

          <!--          <label class="field field-text">-->
          <!--            <span>-->
          <!--              Phone-->
          <!--            </span>-->
          <!--            <input type="text" v-model="profileStore.phone"/>-->
          <!--            <span class="text text-error" v-if="v$.phone.$error">Phone is required and must be numeric</span>-->
          <!--          </label>-->
        </section>

        <!--        <section>-->
        <!--          <h3>-->
        <!--            Bank Details-->
        <!--          </h3>-->


        <!--          <label class="field field-text">-->
        <!--            <span>-->
        <!--              Cardholder name-->
        <!--            </span>-->
        <!--            <input type="text" v-model="profileStore.cardholder_name"/>-->
        <!--            <span class="text text-error" v-if="v$.cardholder_name.$error">Cardholder name is required</span>-->
        <!--          </label>-->

        <!--          <label class="field field-text">-->
        <!--            <span>-->
        <!--              Bank No-->
        <!--            </span>-->
        <!--            <input type="text" v-model="profileStore.bank_number"/>-->
        <!--            <span class="text text-error" v-if="v$.bank_number.$error">Bank No is required</span>-->
        <!--          </label>-->

        <!--        </section>-->

        <section class="monetization">
          <h3>Monetization</h3>

          <label class="field field-select">
            <span>Country</span>
            <select v-model="profileStore.country">
              <option value="">--Please choose an option--</option>
              <option v-for="item in countries" :value="item.code">{{ item.name }}</option>
            </select>
            <span class="text text-error" v-if="v$.country.$error">Country is required </span>
          </label>


          <ul>
            <li>
              <strong>Email</strong>
              <p>{{ profileSnapshot.username }}</p>
            </li>
            <li>
              <strong>Name</strong>
              <p :class="{'text-error': !profileSnapshot.name}">
                {{ profileSnapshot.name || 'Name is required' }}
              </p>
            </li>
            <li>
              <strong>Country</strong>
              <p>{{ profileSnapshot.country || 'Country is required' }}</p>
            </li>

            <li>
              <strong>Last update</strong>
              <p>{{ $formatDate(profileSnapshot.updatedAt) }}</p>
            </li>
          </ul>

          <div v-if="profileStore.stripe_account_id">
            <p class="text text-success">
              <i class="material-symbols-rounded">check</i>
              Monetization is activated
            </p>
            <button type="button" class="btn" @click="activate">
              Express Dashboard
            </button>
          </div>

          <div v-else>
            <p v-show="!profileSnapshot.name || !profileSnapshot.country">
              Complete your profile and hit save in order to be able to activate monetization.
            </p>
            <button type="button" class="btn" :disabled="!profileSnapshot.name || !profileSnapshot.country"
                    @click="activate">
              Activate
            </button>
          </div>
        </section>

        <div class="actions-bar">
          <button class="btn" @click="Auth.signOut">Sign out</button>
        </div>

        <transition name="fade" :duration="150">
          <loader-icon-overlay v-show="loading"></loader-icon-overlay>
        </transition>
      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: .5rem;

  > section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem .8rem;
    background-color: var(--color-background-mute);
    border-radius: 10px;

    > h3 {
      color: var(--vt-c-text-dark-2);
      font-weight: 500;

      + h4 {
        margin-top: 0;
      }
    }

    > h4 {
      margin-top: 1rem;
      font-weight: 500;
    }
  }
}

.monetization {
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: .5rem;

    > button {
      margin-left: auto;
    }
  }

  p {
    flex: 1 1 auto;
  }

  ul {
    font-size: .86rem;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: .6rem;

    > li {
      > strong {
        font-weight: 600;
      }

      > p {
        margin-top: .2rem;
      }
    }
  }
}

</style>
