module Main where

import Prelude
import React.Basic.DOM as R
import Effect (Effect)
import Effect.Unsafe (unsafePerformEffect)
import Data.Maybe (Maybe(..))
import Effect.Exception (throw)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toNonElementParentNode)
import Web.HTML.Window (document)

app = R.text "Hello World!"

foreign import style :: Unit

main :: Unit
main =
  unsafePerformEffect
    $ do
        renderMain

renderMain :: Effect Unit
renderMain = do
  container <- getElementById "mainApp" =<< (map toNonElementParentNode $ document =<< window)
  case container of
    Nothing -> throw "Error"
    Just c -> R.render app c
