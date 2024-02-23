<template>
  <div>
    <TopPanel class="top"  :selected="'home'"/>
    <div class="m-5">
      <h1>Vítej v aplikaci Rozvrhy!</h1>
      <p>Autorem aplikce je David Novák, xnovak2x@vutbr.cz. Tato aplikace byla vytvořena v rámci bakalářské práce na Fakultě informačních technologií VUT v Brně.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';

</script>

 