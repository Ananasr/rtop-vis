(ns rtop-ui.core
  (:require [reagent.core :as reagent :refer [atom]]))

(enable-console-print!)

(println (.-WebSocket js/window))

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:text "Hello world!"}))

(defonce ws (atom nil))

(defn toJSON [o]
  (let [o (if (map? o) (clj->js o) o)]
    (.stringify (.-JSON js/window) o)))

(defn parseJSON [x]
  (.parse (.-JSON js/window) x))

(defn- receive-chat-msg [m]
  (println "message received")
  (println m))

(defn initWS []
  (reset! ws (js/WebSocket. "ws://localhost:8080/ws"))
  (doall
   (map #(aset @ws (first %) (second %))
        [["onopen" (fn [] (println "OPEN"))]
         ["onclose" (fn [] (println "CLOSE"))]
         ["onerror" (fn [e] (println (str "ERROR:" e)))]
         ["onmessage" (fn [m]
                        (let [data (.-data m)
                              d (parseJSON data)]
                          (receive-chat-msg d)))]])))

(if (= (.-WebSocket js/window) nil)
  (println "Your browser does not support WebSockets")
  (initWS))

(defn hello-world []
  [:div
   [:h1 (:text @app-state)]
   [:h3 "ok"]])

(reagent/render-component [hello-world]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
