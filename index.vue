<template>
  <p>{{greeting}} vue</p>
</template>

<script>
console.log("log");
export default {
  data: function() {
    return {
      greeting: "hello"
    };
  },
  created: function() {
    console.log("created");
  }
};
</script>

<style lang="stylus" scoped></style>