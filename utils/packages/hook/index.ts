import { computed } from 'vue'
import { getDataSenderInstance } from "../bury";

export default function () {
  const dataSender = computed(() => getDataSenderInstance())
  return {
    dataSender
  }
}