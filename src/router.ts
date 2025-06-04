import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Register from "./views/Register.vue";
import Groups from "./views/Groups.vue";
import Group from "./views/Group.vue";
import Users from "./views/Users.vue";
import User from "./views/User.vue";
import Meetings from "./views/Meetings.vue";
import Meeting from "./views/Meeting.vue";
import Search from "./views/Search.vue";
import Test from "./views/Test.vue";
import ProjectsCalendar from "./views/ProjectsCalendar.vue";
import Customers from "./views/Customers.vue";

const routes = [
  { path: "/login", component: Login },

  { path: "/register", component: Register },

  { path: "/test", component: Test, meta: { requiresAuth: true } },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/", component: Home, meta: { requiresAuth: true } },
  { path: "/groups", component: Groups, meta: { requiresAuth: true } },
  {
    path: "/group/:id",
    component: Group,
    props: true,
    meta: { requiresAuth: true },
  },
  { path: "/customers", component: Customers, meta: { requiresAuth: true } },
  { path: "/users", component: Users, meta: { requiresAuth: true } },
  { path: "/user", component: User, meta: { requiresAuth: true } },
  { path: "/user/:id", component: User, meta: { requiresAuth: true } },
  { path: "/meetings", component: Meetings, meta: { requiresAuth: true } },
  { path: "/meeting", component: Meeting, meta: { requiresAuth: true } },
  { path: "/meeting/:id", component: Meeting, meta: { requiresAuth: true } },
  {
    path: "/search",
    component: Search,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects/calendar",
    component: ProjectsCalendar,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.meta.requiresAuth &&
    (!localStorage.getItem("acorda.token") || isTokenExpiredFromDate())
  ) {
    next({ path: "/login" });
  } else {
    next();
  }
});

function isTokenExpiredFromDate(): boolean {
  const expire = localStorage.getItem("acorda.expire");
  if (!expire) return true;

  return new Date(expire).getTime() < Date.now();
}

export default router;
