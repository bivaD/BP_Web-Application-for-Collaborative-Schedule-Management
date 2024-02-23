/**
 * @file index.ts
 * @description This file is used for mapping views on paths.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { createRouter, createWebHistory, type Router } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/data/add",
      name: "add",
      component: () => import("../views/AddView.vue"),
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("../views/EditorView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
    },
    
    //ROOM
    {
      path: "/data/rooms/add",
      name: "roomAdd",
      component: () => import("../views/roomViews/RoomAddView.vue"),
    },
    {
      path: "/data/rooms/table",
      name: "roomsTable",
      component: () => import("../views/roomViews/RoomsTableView.vue"),
    },
    {
      path: "/data/rooms/:name",
      name: "roomDetail",
      component: () => import("../views/roomViews/RoomDetailView.vue"),
      props: true,
    },
    {
      path: "/data/rooms/:name/edit",
      name: "roomEdit",
      component: () => import("../views/roomViews/RoomEditView.vue"),
      props: true,
    },

    //UNIT
    {
      path: "/data/units/add",
      name: "unitAdd",
      component: () => import("../views/unitViews/UnitAddView.vue"),
    },
    {
      path: "/data/units/table",
      name: "unitsTable",
      component: () => import("../views/unitViews/UnitsTableView.vue"),
    },
    {
      path: "/data/units/:id",
      name: "unitDetail",
      component: () => import("../views/unitViews/UnitDetailView.vue"),
      props: true,
    },
    {
      path: "/data/units/:id/edit",
      name: "unitEdit",
      component: () => import("../views/unitViews/UnitEditView.vue"),
      props: true,
    },

    //SUBJECT
    {
      path: "/data/subjects/add",
      name: "subjectAdd",
      component: () => import("../views/subjectViews/SubjectAddView.vue"),
    },
    {
      path: "/data/subjects/table",
      name: "subjectsTable",
      component: () => import("../views/subjectViews/SubjectsTableView.vue"),
    },
    {
      path: "/data/subjects/:abbreviation",
      name: "subjectDetail",
      component: () => import("../views/subjectViews/SubjectDetailView.vue"),
      props: true,
    },
    {
      path: "/data/subjects/:abbreviation/edit",
      name: "subjectEdit",
      component: () => import("../views/subjectViews/SubjectEditView.vue"),
      props: true,
    },

    //LECTURER
    {
      path: "/data/lecturers/add",
      name: "lecturerAdd",
      component: () => import("../views/lecturerViews/LecturerAddView.vue"),
    },
    {
      path: "/data/lecturers/table",
      name: "lecturersTable",
      component: () => import("../views/lecturerViews/LecturersTableView.vue"),
    },
    {
      path: "/data/lecturers/:id",
      name: "lecturerDetail",
      component: () => import("../views/lecturerViews/LecturerDetailView.vue"),
      props: true,
    },
    {
      path: "/data/lecturers/:id/edit",
      name: "lecturerEdit",
      component: () => import("../views/lecturerViews/LecturerEditView.vue"),
      props: true,
    },
    //SHARED STUDENTS
    {
      path: "/data/sharedStudents/add",
      name: "sharedStudentsAdd",
      component: () => import("../views/sharedStudentsViews/SharedStudentsAddView.vue"),
    },
    {
      path: "/data/sharedStudents/table",
      name: "sharedStudentsTable",
      component: () => import("../views/sharedStudentsViews/SharedStudentsTableView.vue"),
    },
    //SUITABLE ROOMS
    {
      path: "/data/suitableRooms/add",
      name: "suitableRoomAdd",
      component: () => import("../views/suitableRoomViews/SuitableRoomAddView.vue"),
    },
    {
      path: "/data/suitableRooms/table",
      name: "suitableRoomTable",
      component: () => import("../views/suitableRoomViews/SuitableRoomsTableView.vue"),
    },
    {
      path: "/",
      name: "redirectHome",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: '/:pathMatch(.*)*',
      name: "notFound",
      component: () => import("../views/notFoundView.vue"),
    },
  ],
});

export default router;
