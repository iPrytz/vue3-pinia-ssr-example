<template>
  <div>
    <h3>{{ fruitUserName }}'s favorite fruits</h3>
    <table class="table">
      <thead>
        <tr>
          <th class="c-#67c23a">#</th>
          <th class="c-#e6a23c">Name</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(fruit, index) in fruitList" :key="fruit">
          <tr>
            <td class="c-#67c23a">{{ index }}</td>
            <td class="c-#e6a23c">{{ fruit }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <h3>and {{ colorUserName }}'s favorite color is: {{ color }}</h3>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import '@/styles/market/index.scss';
import { favFruit } from '@/store/favFruit';

export default defineComponent({
  name: 'FavFruit',
  async setup() {

    const favFruitStore = favFruit();
    onServerPrefetch(async () => {
      await favFruitStore.getList();
    });
    onMounted(async ()=> {
      if(!favFruitStore.fruitUserName) {
        await favFruitStore.getList();
      }
    });
    const fruitList = computed(()=> favFruitStore.fruitList || []);
    const fruitUserName = computed(()=> favFruitStore.fruitUserName || '');
    const colorUserName = computed(()=> favFruitStore.colorUserName || '');
    const color = computed(()=> favFruitStore.color || '');

    return { fruitList, fruitUserName, colorUserName, color };
  }
});

</script>