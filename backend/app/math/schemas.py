from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from .parsing import MAX_LENGTH


class CamelModel(BaseModel):
    """JSON uses camelCase (to match the TypeScript frontend); Python uses snake_case."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ExpressionRequest(CamelModel):
    expression: str = Field(min_length=1, max_length=MAX_LENGTH, examples=["x^2"])


class DifferenceQuotientResponse(CamelModel):
    function_latex: str
    quotient_latex: str
    simplified_latex: str
    h_cancels: bool
    derivative_latex: str


class DerivativeStep(CamelModel):
    rule: str
    latex: str


class DerivativeStepsResponse(CamelModel):
    function_latex: str
    steps: list[DerivativeStep]
    derivative_latex: str
    simplified_latex: str | None


class EquivalenceRequest(CamelModel):
    expected: str = Field(min_length=1, max_length=MAX_LENGTH, examples=["6 + h"])
    answer: str = Field(min_length=1, max_length=MAX_LENGTH, examples=["h+6"])


class EquivalenceResponse(CamelModel):
    equivalent: bool
